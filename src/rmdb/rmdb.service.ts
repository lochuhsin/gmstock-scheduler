import { Injectable } from '@nestjs/common';
import { Client } from 'pg';
import {
  rsp_stocks,
  rsp_forexpair,
  rsp_cryptocurrency,
  rsp_etf,
  rsp_indices,
} from 'src/dto/third_party/twelve_data/data';
const format = require('pg-format');
import settings from '../config';
import { db_rsp_symboltask } from '../dto/database/dbresponse';
import { Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RmdbService {
  client = null;
  logger = new Logger(RmdbService.name);

  constructor(private readonly prisma: PrismaService) {
    this.client = new Client(settings.postgres);
    this.client.connect((err) => {
      if (err) {
        this.logger.error('connection error', err.stack);
      } else {
        this.logger.log('connected');
      }
    });
  }
  public async getRowCount(tableName: string): Promise<number> {
    return await this.prisma[tableName].count();
  }

  private async getSymbolTaskWithPlanFilter(
    tableName: string,
  ): Promise<db_rsp_symboltask[]> {
    const plan = settings.twelveData.plan;

    let res: any;
    if (plan == 'Basic') {
      res = await this.prisma[tableName].findMany({
        where: {
          plan: plan,
        },
        select: {
          id: true,
          symbol: true,
          latest_date: true,
          oldest_date: true,
          ishistorydatafinished: true,
        },
      });
    } else {
      const globalFilterObj: object[] = [];
      for (const global of settings.twelveData.global) {
        globalFilterObj.push({
          global: global,
        });
      }
      res = await this.prisma[tableName].findMany({
        where: {
          OR: globalFilterObj,
        },
        select: {
          id: true,
          symbol: true,
          latest_date: true,
          oldest_date: true,
          ishistorydatafinished: true,
        },
      });
    }
    return res;
  }

  public async getSymbolTask(tableName: string): Promise<db_rsp_symboltask[]> {
    let res: any;
    if (tableName == 'stocks' || tableName == 'etf' || tableName == 'indices') {
      res = await this.getSymbolTaskWithPlanFilter(tableName);
    } else {
      res = await this.prisma[tableName].findMany({
        select: {
          id: true,
          symbol: true,
          latest_date: true,
          oldest_date: true,
          ishistorydatafinished: true,
        },
      });
    }
    return res.map((obj) => {
      obj['table_name'] = tableName;
      return obj;
    });
  }

  public async updateLatestDate(
    tableName: string,
    id: number,
    date: Date,
  ): Promise<void> {
    await this.prisma[tableName]
      .update({
        where: {
          id: id,
        },
        data: {
          latest_date: date,
        },
      })
      .catch((d) => this.logger.error(d));
  }
  public async updateOldestDate(
    tableName: string,
    id: number,
    date: Date,
  ): Promise<void> {
    await this.prisma[tableName]
      .update({
        where: {
          id: id,
        },
        data: {
          oldest_date: date,
        },
      })
      .catch((d) => this.logger.error(d));
  }

  public async updateIsHistoryDataFinished(
    tableName: string,
    id: number,
    status: boolean,
  ): Promise<void> {
    await this.prisma[tableName]
      .update({
        where: {
          id: id,
        },
        data: {
          ishistorydatafinished: status,
        },
      })
      .catch((d) => this.logger.error(d));
  }

  public async bulkUpsertTable<T>(rsp_data: T[], tableName: string) {
    switch (tableName) {
      case 'stocks':
        await this.bulkUpsertTableResponse<T>(
          ['symbol', 'mic_code'],
          tableName,
          [
            'symbol',
            'name',
            'currency',
            'exchange',
            'mic_code',
            'country',
            'type',
            'global',
            'plan',
          ],
          rsp_data,
        );
        break;
      case 'forexpair':
        await this.bulkUpsertTableResponse<T>(
          ['symbol', 'currency_base'],
          tableName,
          ['symbol', 'currency_group', 'currency_base', 'currency_quote'],
          rsp_data,
        );
        break;
      case 'cryptocurrency':
        await this.bulkUpsertTableResponse<T>(
          ['symbol', 'currency_base'],
          tableName,
          ['symbol', 'available_exchange', 'currency_base', 'currency_quote'],
          rsp_data,
        );
        break;
      case 'etf':
        await this.bulkUpsertTableResponse<T>(
          ['symbol', 'mic_code'],
          tableName,
          [
            'symbol',
            'name',
            'currency',
            'exchange',
            'mic_code',
            'country',
            'global',
            'plan',
          ],
          rsp_data,
        );
        break;

      case 'indices':
        await this.bulkUpsertTableResponse<T>(
          ['symbol', 'country'],
          tableName,
          ['symbol', 'name', 'country', 'currency', 'global', 'plan'],
          rsp_data,
        );
        break;
      default:
        throw TypeError('tableName error');
    }
  }

  public async bulkInsertStocks(inputs: rsp_stocks[]): Promise<any> {
    const currentTime = new Date();
    const data = inputs.map((d) => {
      return {
        symbol: d.symbol,
        name: d.name,
        currency: d.currency,
        exchange: d.exchange,
        mic_code: d.mic_code,
        country: d.country,
        type: d.type,
        latest_date: currentTime,
        oldest_date: currentTime,
        ishistorydatafinished: false,
        table_update_date: currentTime,
        global: d.access.global,
        plan: d.access.plan,
      };
    });

    return await this.prisma.stocks
      .createMany({
        data: data,
      })
      .catch((d) => this.logger.error(d));
  }

  public async bulkInsertForexPair(inputs: rsp_forexpair[]): Promise<any> {
    const currentTime = new Date();
    const data = inputs.map((d) => {
      return {
        symbol: d.symbol,
        currency_group: d.currency_group,
        currency_base: d.currency_base,
        currency_quote: d.currency_quote,
        latest_date: currentTime,
        oldest_date: currentTime,
        ishistorydatafinished: false,
        table_update_date: currentTime,
      };
    });

    return await this.prisma.forexpair
      .createMany({
        data: data,
      })
      .catch((d) => this.logger.error(d));
  }

  public async bulkInsertCryptoCurrency(
    inputs: rsp_cryptocurrency[],
  ): Promise<any> {
    const currentTime = new Date();
    const data = inputs.map((d) => {
      return {
        symbol: d.symbol,
        available_exchange: d.available_exchanges.toString(),
        currency_base: d.currency_base,
        currency_quote: d.currency_quote,
        latest_date: currentTime,
        oldest_date: currentTime,
        ishistorydatafinished: false,
        table_update_date: currentTime,
      };
    });

    return await this.prisma.cryptocurrency
      .createMany({
        data: data,
      })
      .catch((d) => this.logger.error(d));
  }

  public async bulkInsertETF(inputs: rsp_etf[]): Promise<any> {
    const currentTime = new Date();
    const data = inputs.map((d) => {
      return {
        symbol: d.symbol,
        name: d.name,
        currency: d.currency,
        exchange: d.exchange,
        mic_code: d.mic_code,
        country: d.country,
        latest_date: currentTime,
        oldest_date: currentTime,
        ishistorydatafinished: false,
        table_update_date: currentTime,
        global: d.access.global,
        plan: d.access.plan,
      };
    });

    return await this.prisma.etf
      .createMany({
        data: data,
      })
      .catch((d) => this.logger.error(d));
  }

  public async bulkInsertIndice(inputs: rsp_indices[]): Promise<any> {
    const currentTime = new Date();
    const data = inputs.map((d) => {
      return {
        symbol: d.symbol,
        name: d.name,
        country: d.country,
        currency: d.currency,
        latest_date: currentTime,
        oldest_date: currentTime,
        ishistorydatafinished: false,
        table_update_date: currentTime,
        global: d.access.global,
        plan: d.access.plan,
      };
    });

    return await this.prisma.indices
      .createMany({
        data: data,
      })
      .catch((d) => this.logger.error(d));
  }

  // input data format : symbol, datetime, open, high, low, close, volume
  async bulkInsertTableData(
    tableName: string,
    data: string[][],
  ): Promise<void> {
    const dataTableName = tableName + 'data';
    const query = format(
      `INSERT INTO ${dataTableName} (symbol, record_date_time, open, high, low, close, volume) VALUES %L`,
      data,
    );
    this.client.query(query, (err, _) => {
      if (err) {
        this.logger.log(err);
      }
    });
  }

  // input data format : symbol, datetime, open, high, low, close, volume
  public async insertTableData(
    tableName: string,
    data: string[],
  ): Promise<void> {
    const dataTableName = tableName + 'data';
    const d = [data];
    const query = format(
      `INSERT INTO ${dataTableName} (symbol, record_date_time, open, high, low, close, volume) VALUES %L`,
      d,
    );
    this.client.query(query, (err, _) => {
      if (err) {
        this.logger.log(err);
      }
    });
  }

  private static createUnique<T>(obj: T, properties: string[]): string {
    const propList: string[] = [];
    for (const prop of properties) {
      propList.push(obj[prop]);
    }
    return propList.join('_');
  }

  private async bulkUpsertTableResponse<T>(
    propertyList: string[],
    tableName: string,
    updateColumns: string[],
    rspData: T[],
  ): Promise<void> {
    const dbSet: Set<string> = new Set();

    const select = {};
    for (const prop of propertyList) {
      select[prop] = true;
    }

    const db_resp = await this.prisma[tableName].findMany({
      select: select,
    });

    for (const obj of db_resp) {
      dbSet.add(RmdbService.createUnique(obj, propertyList));
    }

    const exists: T[] = [];
    const nonexist: T[] = [];

    for (const rsp of rspData) {
      const unique: string = RmdbService.createUnique(rsp, propertyList);
      if (dbSet.has(unique)) {
        exists.push(rsp);
      } else {
        nonexist.push(rsp);
      }
    }

    if (nonexist.length > 0) {
      switch (tableName) {
        case 'stocks':
          // @ts-ignore
          await this.bulkInsertStocks(nonexist);
          break;
        case 'forexpair':
          // @ts-ignore
          await this.bulkInsertForexPair(nonexist);
          break;
        case 'cryptocurrency':
          // @ts-ignore
          await this.bulkInsertCryptoCurrency(nonexist);
          break;
        case 'etf':
          // @ts-ignore
          await this.bulkInsertETF(nonexist);
          break;
        case 'indices':
          // @ts-ignore
          await this.bulkInsertIndice(nonexist);
          break;
        default:
          throw TypeError('tableName error');
      }
    } else {
      this.logger.log('no new objects to update');
    }

    const uniqueKeyName = propertyList.join('_');
    const currentTime = new Date();
    for (const obj of exists) {
      const uniqueWhere = {};
      for (const prop of propertyList) {
        uniqueWhere[prop] = obj[prop];
      }

      const where = {};
      where[uniqueKeyName] = uniqueWhere;

      const data = {};
      for (const column of updateColumns) {
        // find a better place to convert data
        if (column == 'plan' || column == 'global') {
          if (obj['access'] != undefined) {
            data[column] = obj['access'][column];
          }
        } else {
          data[column] = obj[column];
        }
      }
      data['table_update_date'] = currentTime;

      await this.prisma[tableName].update({
        where: where,
        data: data,
      });
    }
    this.logger.log('upsert completed');
  }
}
