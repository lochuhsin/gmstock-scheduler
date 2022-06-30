import { Injectable, Logger } from '@nestjs/common';
import { rmdb } from '../dao/rmdb';
import { util } from '../util/util';
import { db_rsp_symboltask } from '../dto/database/dbresponse';
import { TwelveData } from '../third_party/twelveData';
import settings from '../config';

@Injectable()
export class UpdateService {
  private readonly logger = new Logger(UpdateService.name);
  private readonly updateTaskQue: util.queue<db_rsp_symboltask>;
  private readonly dailyTaskQue: util.queue<db_rsp_symboltask>;
  private readonly historyTaskQue: util.queue<db_rsp_symboltask>;
  private readonly errorTaskQue: util.queue<db_rsp_symboltask>;

  private leftAPICount = settings.api['apicount'];
  private readonly historyInterval = settings.api['historyInterval']; //day

  private readonly pgDatabase = new rmdb.postgres();
  private readonly tableList = [
    'stocks',
    'forexpair',
    'cryptocurrency',
    'etf',
    'indices',
  ];

  constructor() {
    this.historyTaskQue = new util.queue<db_rsp_symboltask>();
    this.dailyTaskQue = new util.queue<db_rsp_symboltask>();
  }

  async initSymbolTasks(): Promise<void> {
    await this.fillSymbolTasks();

    console.log(this.historyTaskQue.getSize());
    this.logger.log(`Init Symbol Tasks at ${util.getCurrentDateTime()}`);
  }

  async runSymbolTasks(): Promise<void> {
    if (this.leftAPICount > 0) {
      //Run history
      if (this.historyTaskQue.getSize() > 0) {
        const task: db_rsp_symboltask = this.historyTaskQue.peek();
        const end_date = task.oldest_date;
        const start_date = util.modifyDateTimeWithDay(
          end_date,
          -this.historyInterval, // go back this amount of days
          // not finished yet
        );

        await this.runHistory(task, start_date, end_date); // finished
        this.leftAPICount--;
      }

      // Run update
      if (this.updateTaskQue.getSize() > 0) {
        await this.runUpdate();
        this.leftAPICount--;
      }

      // Run daily
      if (this.dailyTaskQue.getSize() > 0) {
        await this.runDaily();
        this.leftAPICount--;
      }
    }
  }

  private async runUpdate() {
    const task: db_rsp_symboltask = this.updateTaskQue.pop();
    let result: string[][];
    try {
      const updateDateTime = util.modifyDateTimeWithDay(
        util.getCurrentDateTime(),
        -1,
      );
      result = await TwelveData.timeSeries(
        task.symbol,
        task.latest_date,
        updateDateTime,
      );
    } catch (e) {
      this.logger.warn(`Symbol ${task.symbol} update failed`);
      this.logger.warn(e.message);
      this.errorTaskQue.push(task);
    }
    if (result == null) {
      // handle situation of no data
    }
    result.shift(); // remove the first element since it is column name
    await this.pgDatabase.bulkInsertTableData(task.table_name, result);
  }

  private async runDaily() {
    // Run update
    const task: db_rsp_symboltask = this.dailyTaskQue.pop();
    const symbol = task.symbol;
    try {
      const result = await TwelveData.latest(symbol);
      this.pgDatabase.insertTableData(task.table_name, result);
    } catch (e) {
      this.logger.warn(`Symbol ${symbol} update failed`);
      this.errorTaskQue.push(task);
    }
  }

  // not finished
  private async runHistory(task, start_date, end_date): Promise<any> {
    let result: string[][];
    try {
      result = await TwelveData.timeSeries(task.symbol, start_date, end_date);
      if(result == null){
        // handle situation of no data
      }
    } catch (e) {
      this.logger.error(`task failed with error: ${e}`);
      return -1;
    }
  }

  private async fillSymbolTasks() {
    for (const table_name of this.tableList) {
      const result: db_rsp_symboltask[] = await this.pgDatabase.getSymbolTask(
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

  private static isUpdated(date: string): boolean {
    const currentDate = util.getCurrentDate();
    const latestDate = util.modifyDateWithDay(currentDate, -1);
    return date == latestDate;
  }
}
