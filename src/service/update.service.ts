import { Injectable, Logger } from '@nestjs/common';
import { util } from '../util/util';
import { db_rsp_symboltask } from '../dto/database/dbresponse';
import { TwelveData } from '../third_party/twelveData';
import settings from '../config';
import { RmdbService } from 'src/rmdb/rmdb.service';

enum TaskType {
  daily,
  update,
  history,
}

@Injectable()
export class UpdateService {
  private readonly logger = new Logger(UpdateService.name);
  private readonly updateTaskQue: util.queue<db_rsp_symboltask>;
  private readonly dailyTaskQue: util.queue<db_rsp_symboltask>;
  private readonly historyTaskQue: util.queue<db_rsp_symboltask>;
  private readonly errorTaskQue: util.queue<[db_rsp_symboltask, TaskType]>;

  private leftAPICount = settings.api['apicount'];
  private readonly historyInterval = settings.api['historyInterval']; //day

  private readonly tableList = [
    'stocks',
    'forexpair',
    'cryptocurrency',
    'etf',
    'indices',
  ];

  constructor(private readonly rmdbService: RmdbService) {
    this.historyTaskQue = new util.queue<db_rsp_symboltask>();
    this.dailyTaskQue = new util.queue<db_rsp_symboltask>();
    this.updateTaskQue = new util.queue<db_rsp_symboltask>();
  }

  async initSymbolTasks(): Promise<void> {
    await this.fillSymbolTasks();
    this.logger.log(`Init Symbol Tasks at ${util.getCurrentDateTime()}`);
  }

  async runSymbolTasks(): Promise<void> {
    if (this.leftAPICount > 0) {
      if (this.historyTaskQue.getSize() > 0) {
        await this.runHistory(); // finished
        this.leftAPICount--;
      }

      if (this.updateTaskQue.getSize() > 0) {
        await this.runUpdate();
        this.leftAPICount--;
      }

      if (this.dailyTaskQue.getSize() > 0) {
        await this.runDaily();
        this.leftAPICount--;
      }
    }
  }

  private async runHistory(): Promise<void> {
    const task: db_rsp_symboltask = this.historyTaskQue.pop();
    const endDate = task.oldest_date;
    const copyDate = new Date(endDate.valueOf());
    copyDate.setDate(copyDate.getDate() - this.historyInterval);

    const endDateString = util.convertDateToDateString(endDate);
    const startDateString = util.convertDateToDateString(copyDate);

    let result: string[][] | null;
    try {
      result = await TwelveData.timeSeries(
        task.symbol,
        startDateString,
        endDateString,
      );
    } catch (e) {
      this.logger.error(`task failed with error: ${e}`);
      this.errorTaskQue.push([task, TaskType.history]);
    }

    if (result == null) {
      await this.rmdbService.updateIsHistoryDataFinished(
        task.table_name,
        task.id,
        true,
      );
    } else {
      result.shift(); // remove columns

      result.map((obj) => {
        obj.unshift(task.symbol);
        return obj;
      })

      await this.rmdbService.bulkInsertTableData(task.table_name, result);
      const oldestDate: Date = new Date(result[result.length-1][1]);
      await this.rmdbService.updateOldestDate(
        task.table_name,
        task.id,
        oldestDate,
      );
    }
  }

  private async runUpdate() {
    const task: db_rsp_symboltask = this.updateTaskQue.pop();
    let result: string[][];
    try {
      const updateDateTime: Date = new Date();

      const endDate = util.convertDateToDateString(updateDateTime);
      const startDate = util.convertDateToDateString(task.latest_date);

      result = await TwelveData.timeSeries(task.symbol, startDate, endDate);
    } catch (e) {
      this.logger.warn(
        `Symbol ${task.symbol} update failed, error ${e.message}`,
      );
      this.errorTaskQue.push([task, TaskType.update]);
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
  }

  private async runDaily() {
    const task: db_rsp_symboltask = this.dailyTaskQue.pop();
    const symbol = task.symbol;
    try {
      const result = await TwelveData.latest(symbol);
      await this.rmdbService.insertTableData(task.table_name, result);
      const datetime: Date = new Date(result[0]);
      await this.rmdbService.updateLatestDate(
        task.table_name,
        task.id,
        datetime,
      );
    } catch (e) {
      this.logger.warn(`Symbol ${symbol} update failed`);
      this.errorTaskQue.push([task, TaskType.daily]);
    }
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

        if (!UpdateService.isUpdated(obj.latest_date)) {
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
