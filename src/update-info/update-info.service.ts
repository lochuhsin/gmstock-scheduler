import { Injectable, Logger } from '@nestjs/common';
import { util } from '../util/util';
import {
  db_rsp_cryptocurrencytask,
  db_rsp_forexpairtask,
  db_rsp_etftask,
  db_rsp_indicetask,
  db_rsp_stocktask,
  db_rsp_timeserise,
} from '../dto/database/dbresponse';
import settings from '../config';
import { RmdbService } from 'src/rmdb/rmdb.service';
import { TwelveDataService } from 'src/third-party/twelve-data/twelve-data.service';
import { MongodbService } from 'src/mongodb/mongodb.service';
import {
  rsp_stocks,
  rsp_forexpair,
  rsp_cryptocurrency,
  rsp_etf,
  rsp_indices,
  timeseries,
} from 'src/dto/third_party/twelve_data/data';

enum QueueType {
  daily,
  update,
  history,
}

type taskType =
  | db_rsp_stocktask
  | db_rsp_forexpairtask
  | db_rsp_cryptocurrencytask
  | db_rsp_etftask
  | db_rsp_indicetask;

@Injectable()
export class UpdateInfoService {
  private readonly waitTime = 1000; // ms
  private readonly logger = new Logger(UpdateInfoService.name);
  private readonly updateTaskQue: util.queue<taskType>;
  private readonly dailyTaskQue: util.queue<taskType>;
  private readonly historyTaskQue: util.queue<taskType>;
  private readonly errorTaskQue: util.queue<[taskType, QueueType]>;

  private leftAPICount = 0;
  private readonly historyInterval = settings.api.historyInterval;

  constructor(
    private readonly twelveDataService: TwelveDataService,
    private readonly rmdbService: RmdbService,
    private readonly mongodbService: MongodbService,
  ) {
    this.historyTaskQue = new util.queue<taskType>();
    this.dailyTaskQue = new util.queue<taskType>();
    this.updateTaskQue = new util.queue<taskType>();
  }

  public getSymbolTaskCount() {
    return {
      history: this.historyTaskQue.getSize(),
      daily: this.dailyTaskQue.getSize(),
      update: this.updateTaskQue.getSize(),
    };
  }

  public initApiCount(): void {
    this.leftAPICount = settings.api.apicount;
  }

  public async initSymbolTasks(): Promise<void> {
    this.historyTaskQue.clear();
    this.dailyTaskQue.clear();
    this.updateTaskQue.clear();
    await this.fillSymbolTasks();
    this.logger.log(`Init Symbol Tasks at ${new Date()}`);
  }

  public async initDailySymbolTasks(): Promise<void> {
    const tableTasks: any[] = await this.getAllTasks();
    for (const tasks of tableTasks) {
      for (const obj of tasks) {
        this.dailyTaskQue.push(obj);
      }
    }
  }

  public getCurrentAPICount(): number {
    return this.leftAPICount;
  }

  public clearTaskQueue(): object {
    this.historyTaskQue.clear();
    this.dailyTaskQue.clear();
    this.updateTaskQue.clear();
    this.logger.log(`Remove Symbol Tasks at ${new Date()}`);
    return {
      history: this.historyTaskQue.getSize(),
      daily: this.dailyTaskQue.getSize(),
      update: this.updateTaskQue.getSize(),
    };
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
    if (this.leftAPICount <= 0) {
      this.logger.log('No api left');
      return null;
    }

    if (this.historyTaskQue.getSize() > 0) {
      await this.runHistory();
      this.leftAPICount--;
      this.logger.log(`API count left ${this.leftAPICount}`);
      return null; //return after finished a task
    } else {
      this.logger.log('history task queue is empty');
    }

    if (this.updateTaskQue.getSize() > 0) {
      await this.runUpdate();
      this.leftAPICount--;
      this.logger.log(`API count left ${this.leftAPICount}`);
      return null; //return after finished a task
    } else {
      this.logger.log('update task queue is empty');
    }

    if (this.dailyTaskQue.getSize() > 0) {
      await this.runDaily();
      this.leftAPICount--;
      this.logger.log(`API count left ${this.leftAPICount}`);
      return null; //return after finished a task
    } else {
      this.logger.log('daily task queue is empty');
    }
  }

  private async updateTimeSeries(
    task: taskType,
    startDateString,
    endDateString,
    queueType: QueueType,
  ): Promise<db_rsp_timeserise[] | null> {
    let result: timeseries[] | string;

    try {
      result = await this.twelveDataService.timeSeries(
        task.unique,
        startDateString,
        endDateString,
      );
    } catch (e) {
      this.logger.warn(
        `task type: ${queueType}, unique: ${task.unique} failed with error: ${e}`,
      );
      this.errorTaskQue.push([task, queueType]);
      return null;
    }

    if (typeof result == 'string') {
      if (
        result ==
        'No data is available on the specified dates. Try setting different start/end dates.'
      ) {
        this.logger.log(
          `task type: ${queueType}, unique: ${task.unique} finished`,
        );
        await this.rmdbService.updateIsHistoryDataFinished(
          task.table_name,
          task.id,
          true,
        );
      } else {
        this.logger.warn(
          `task type: ${queueType}, unique: ${task.unique} failed with error: ${result}`,
        );
        this.errorTaskQue.push([task, QueueType.history]);
      }
      return null;
    }
    const timeseries: db_rsp_timeserise[] = [];
    for (const obj of result) {
      timeseries.push({
        datetime: new Date(obj.datetime),
        open: Number(obj.open),
        high: Number(obj.high),
        low: Number(obj.low),
        close: Number(obj.close),
        volume: Number(obj.volume),
      });
    }
    await this.mongodbService.bulkInsertTimeSeries(task.unique, timeseries);
    return timeseries;
  }

  private async runHistory(): Promise<void> {
    this.logger.log(
      `running ${
        QueueType.history
      } task queue, task amount: ${this.historyTaskQue.getSize()}`,
    );

    const task: taskType = this.historyTaskQue.pop();
    const endDate = task.oldest_date;
    const copyDate = new Date(endDate.valueOf());
    copyDate.setDate(copyDate.getDate() - this.historyInterval);

    const endDateString = util.convertDateToDateString(endDate);
    const startDateString = util.convertDateToDateString(copyDate);
    const rsp = await this.updateTimeSeries(
      task,
      startDateString,
      endDateString,
      QueueType.history,
    );
    if (rsp == null) return;
    const oldestDate: Date = new Date(rsp[rsp.length - 1].datetime);
    await this.rmdbService.updateOldestDate(
      task.table_name,
      task.id,
      oldestDate,
    );
    this.logger.log(`${QueueType.history} data update at ${new Date()}`);
  }

  private async runUpdate() {
    this.logger.log(
      `running ${
        QueueType.update
      } task queue, task amount: ${this.updateTaskQue.getSize()}`,
    );
    const task: taskType = this.updateTaskQue.pop();
    const endDate = util.convertDateToDateString(new Date());
    const startDate = util.convertDateToDateString(task.latest_date);
    const rsp = await this.updateTimeSeries(
      task,
      startDate,
      endDate,
      QueueType.update,
    );

    if (rsp == null) return;
    const latestDate = new Date(rsp[0].datetime);
    await this.rmdbService.updateLatestDate(
      task.table_name,
      task.id,
      latestDate,
    );
    this.logger.log(`update data update at ${new Date()}`);
  }

  private async runDaily() {
    this.logger.log(
      `running daily task queue, task amount: ${this.dailyTaskQue.getSize()}`,
    );
    const task: taskType = this.dailyTaskQue.pop();
    const symbol = task.symbol;
    let result: timeseries;
    try {
      result = await this.twelveDataService.latest(symbol);
    } catch (e) {
      this.logger.warn(`Symbol ${symbol} update failed`);
      this.errorTaskQue.push([task, QueueType.daily]);
    }
    if (result != null) {
      const latestDate = new Date(result.datetime);
      await this.rmdbService.updateLatestDate(
        task.table_name,
        task.id,
        latestDate,
      );
      const res: db_rsp_timeserise = {
        datetime: new Date(result.datetime),
        open: Number(result.open),
        high: Number(result.high),
        low: Number(result.low),
        close: Number(result.close),
        volume: Number(result.volume),
      };
      await this.mongodbService.insertTimeSeries(task.unique, res);
    }
    this.logger.log(`Daily data update at ${new Date()}`);
  }

  private async getAllTasks(): Promise<any[]> {
    const stocksTasks: db_rsp_stocktask[] =
      await this.rmdbService.getStockSymbolTasks();
    const forexpairTasks: db_rsp_forexpairtask[] =
      await this.rmdbService.getForexPairSymbolTasks();
    const cryptoTasks: db_rsp_cryptocurrencytask[] =
      await this.rmdbService.getCryptoCurrencySymbolTasks();
    const etfTasks: db_rsp_etftask[] =
      await this.rmdbService.getETFSymbolTasks();
    const indicesTasks: db_rsp_indicetask[] =
      await this.rmdbService.getIndiceSymbolTasks();
    return [stocksTasks, forexpairTasks, cryptoTasks, etfTasks, indicesTasks];
  }

  private async fillSymbolTasks() {
    const tableTasks: any[] = await this.getAllTasks();

    for (const tasks of tableTasks) {
      for (const obj of tasks) {
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
