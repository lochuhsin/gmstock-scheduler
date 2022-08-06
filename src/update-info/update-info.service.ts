import { Injectable, Logger } from '@nestjs/common';
import { util } from '../util/util';
import { db_rsp_symboltask } from '../dto/database/dbresponse';
import settings from '../config';
import { RmdbService } from 'src/rmdb/rmdb.service';
import { TwelveDataService } from 'src/third-party/twelve-data/twelve-data.service';
import {
  rsp_stocks,
  rsp_forexpair,
  rsp_cryptocurrency,
  rsp_etf,
  rsp_indices,
} from 'src/dto/third_party/twelve_data/data';

enum TaskType {
  daily,
  update,
  history,
}

@Injectable()
export class UpdateInfoService {
  private readonly waitTime = 1000; // ms
  private readonly logger = new Logger(UpdateInfoService.name);
  private readonly updateTaskQue: util.queue<db_rsp_symboltask>;
  private readonly dailyTaskQue: util.queue<db_rsp_symboltask>;
  private readonly historyTaskQue: util.queue<db_rsp_symboltask>;
  private readonly errorTaskQue: util.queue<[db_rsp_symboltask, TaskType]>;

  private leftAPICount = 0;
  private readonly historyInterval = settings.api['historyInterval']; //day

  private readonly tableList = [
    'stocks',
    'forexpair',
    'cryptocurrency',
    'etf',
    'indices',
  ];

  constructor(
    private readonly twelveDataService: TwelveDataService,
    private readonly rmdbService: RmdbService,
  ) {
    this.historyTaskQue = new util.queue<db_rsp_symboltask>();
    this.dailyTaskQue = new util.queue<db_rsp_symboltask>();
    this.updateTaskQue = new util.queue<db_rsp_symboltask>();
  }

  testFunc(): void {
    console.log('Hello world');
  }
  public async initApiCount(): Promise<void> {
    this.leftAPICount = settings.api['apicount'];
  }

  public async initSymbolTasks(): Promise<void> {
    await this.fillSymbolTasks();
    this.logger.log(`Init Symbol Tasks at ${util.getCurrentDateTime()}`);
  }

  public getCurrentAPICount(): number {
    return this.leftAPICount;
  }

  public async updateSymbolTables(): Promise<void> {
    const tableUpdateArr = [
      [
        'stocks',
        rsp_stocks,
        this.twelveDataService.allStocks.bind(this.twelveDataService),
      ],
      [
        'forexpair',
        rsp_forexpair,
        this.twelveDataService.allForexPair.bind(this.twelveDataService),
      ],
      [
        'cryptocurrency',
        rsp_cryptocurrency,
        this.twelveDataService.allCryptoCurrency.bind(this.twelveDataService),
      ],
      [
        'etf',
        rsp_etf,
        this.twelveDataService.allETF.bind(this.twelveDataService),
      ],
      [
        'indices',
        rsp_indices,
        this.twelveDataService.allIndices.bind(this.twelveDataService),
      ],
    ];

    for (const [tableName, templateType, func] of tableUpdateArr) {
      const rsp: typeof templateType[] = await func();
      this.logger.log(tableName);
      await this.rmdbService.bulkUpsertTable<typeof templateType>(
        rsp,
        tableName,
      );
      await util.sleep(this.waitTime);
    }
  }

  public async runSymbolTasks(): Promise<void> {
    if (this.leftAPICount > 0) {
      if (this.historyTaskQue.getSize() > 0) {
        await this.runHistory();
        this.leftAPICount--;
      } else {
        this.logger.log('history task queue is empty');
      }
      this.logger.log(`API count left ${this.leftAPICount}`);

      if (this.updateTaskQue.getSize() > 0) {
        await this.runUpdate();
        this.leftAPICount--;
      } else {
        this.logger.log('update task queue is empty');
      }
      this.logger.log(`API count left ${this.leftAPICount}`);

      if (this.dailyTaskQue.getSize() > 0) {
        await this.runDaily();
        this.leftAPICount--;
      } else {
        this.logger.log('daily task queue is empty');
      }
      this.logger.log(`API count left ${this.leftAPICount}`);
    }
  }

  private async runHistory(): Promise<void> {
    this.logger.log(
      `running history task queue, task amount: ${this.historyTaskQue.getSize()}`,
    );

    const task: db_rsp_symboltask = this.historyTaskQue.pop();
    const endDate = task.oldest_date;
    const copyDate = new Date(endDate.valueOf());
    copyDate.setDate(copyDate.getDate() - this.historyInterval);

    const endDateString = util.convertDateToDateString(endDate);
    const startDateString = util.convertDateToDateString(copyDate);

    let result: string[][] | null;
    try {
      result = await this.twelveDataService.timeSeries(
        task.symbol,
        startDateString,
        endDateString,
      );
    } catch (e) {
      this.logger.warn(`task failed with error: ${e}`);
      this.errorTaskQue.push([task, TaskType.history]);
      return null;
    }

    if (result == null) {
      await this.rmdbService.updateIsHistoryDataFinished(
        task.table_name,
        task.id,
        true,
      );
    } else {
      result.shift();
      result.map((obj) => {
        obj.unshift(task.symbol);
        return obj;
      });
      await this.rmdbService.bulkInsertTableData(task.table_name, result);
      const oldestDate: Date = new Date(result[result.length - 1][1]);
      await this.rmdbService.updateOldestDate(
        task.table_name,
        task.id,
        oldestDate,
      );
    }
    this.logger.log(`history data update at ${new Date()}`);
  }

  private async runUpdate() {
    this.logger.log(
      `running update task queue, task amount: ${this.updateTaskQue.getSize()}`,
    );
    const task: db_rsp_symboltask = this.updateTaskQue.pop();
    let result: string[][];
    try {
      const endDate = util.convertDateToDateString(new Date());
      const startDate = util.convertDateToDateString(task.latest_date);

      result = await this.twelveDataService.timeSeries(
        task.symbol,
        startDate,
        endDate,
      );
    } catch (e) {
      this.logger.warn(
        `Symbol ${task.symbol} update failed, error ${e.message}`,
      );
      this.errorTaskQue.push([task, TaskType.update]);
      return null;
    }

    if (result != null) {
      result.shift(); // remove the first element since it is column name
      result.map((obj) => {
        obj.unshift(task.symbol);
        return obj;
      });

      await this.rmdbService.bulkInsertTableData(task.table_name, result);
      const latestDate = new Date(result[0][1]);
      await this.rmdbService.updateLatestDate(
        task.table_name,
        task.id,
        latestDate,
      );
    }
    this.logger.log(`Update data update at ${new Date()}`);
  }

  private async runDaily() {
    this.logger.log(
      `running daily task queue, task amount: ${this.dailyTaskQue.getSize()}`,
    );
    const task: db_rsp_symboltask = this.dailyTaskQue.pop();
    const symbol = task.symbol;
    let result: string[] | null;
    try {
      result = await this.twelveDataService.latest(symbol);
    } catch (e) {
      this.logger.warn(`Symbol ${symbol} update failed`);
      this.errorTaskQue.push([task, TaskType.daily]);
    }
    if (result != null) {
      result.unshift(task.symbol);
      const latestDate = new Date(result[1]);
      await this.rmdbService.updateLatestDate(
        task.table_name,
        task.id,
        latestDate,
      );
      await this.rmdbService.insertTableData(task.table_name, result);
    }
    this.logger.log(`Daily data update at ${new Date()}`);
  }

  private async fillSymbolTasks() {
    for (const table_name of this.tableList) {
      const result: db_rsp_symboltask[] = await this.rmdbService.getSymbolTask(
        table_name,
      );
      for (const obj of result) {
        if (!obj.ishistorydatafinished) {
          this.historyTaskQue.push(obj);
        }

        if (!UpdateInfoService.isUpdated(obj.latest_date)) {
          this.updateTaskQue.push(obj);
        }

        this.dailyTaskQue.push(obj);
      }
    }
  }

  private static isUpdated(date: Date): boolean {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    return (
      util.convertDateToDateString(date) ==
      util.convertDateToDateString(currentDate)
    );
  }
}
