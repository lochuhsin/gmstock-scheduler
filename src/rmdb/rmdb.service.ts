import { Injectable } from '@nestjs/common';
import { Client } from 'pg';
import {
  rsp_stocks,
  rsp_forexpair,
  rsp_cryptocurrency,
  rsp_etf,
  rsp_indices,
} from 'src/dto/third_party/twelve_data/stocks';
const format = require('pg-format');
import settings from '../config';
import { db_rsp_symboltask } from '../dto/database/dbresponse';
import { Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { exists } from 'fs';

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
  async getRowCount(tableName: string): Promise<number> {
    return await this.prisma[tableName].count();
  }

  async getSymbolTask(tableName: string): Promise<db_rsp_symboltask[]> {
    const res = await this.prisma[tableName].findMany({
      select: {
        id: true,
        symbol: true,
        latest_date: true,
        oldest_date: true,
        ishistorydatafinished: true,
      },
    });

    return res.map((obj) => {
      obj['tableName'] = tableName;
      return obj;
    });
  }

  async updateLatestDate(
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
  async updateOldestDate(
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

  async updateIsHistoryDataFinished(
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

  async bulkInsertStocks(inputs: rsp_stocks[] | object[]): Promise<any> {
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
      };
    });

    return await this.prisma.stocks
      .createMany({
        data: data,
      })
      .catch((d) => this.logger.error(d));
  }
  // TODO: Convert all bulk Upsert functions to stratagy method
  async bulkUpsertStocks(inputs: rsp_stocks[]): Promise<any> {
    const currentTime = new Date();
    const forexpairHashMap: Map<string, rsp_stocks> = new Map();
    for (const obj of inputs) {
      const unique: string = [obj.symbol, obj.mic_code].join(',');
      forexpairHashMap.set(unique, obj);
    }

    const existsforexpair: rsp_stocks[] = [];
    const nonexistsforexpair: rsp_stocks[] = [];
    const db_resp = await this.prisma['stocks'].findMany({
      select: {
        symbol: true,
        mic_code: true,
      },
    });

    this.logger.log('database retrieve complete');
    for (const obj of db_resp) {
      const unique = [obj.symbol, obj.mic_code].join(',');
      if (forexpairHashMap.has(unique)) {
        existsforexpair.push(forexpairHashMap.get(unique));
      } else {
        nonexistsforexpair.push(forexpairHashMap.get(unique));
      }
    }

    this.logger.log(`exists: ${existsforexpair.length}`);
    this.logger.log(`nonexists: ${nonexistsforexpair.length}`);
    this.logger.log('seperation complete');

    if (nonexistsforexpair.length > 0) {
      await this.bulkInsertStocks(nonexistsforexpair);
      this.logger.log('bulk create complete');
    } else {
      this.logger.log('new stock empty');
    }

    for (const obj of existsforexpair) {
      await this.prisma.stocks.update({
        where: {
          symbol_mic_code: {
            symbol: obj.symbol,
            mic_code: obj.mic_code,
          },
        },
        data: {
          symbol: obj.symbol,
          name: obj.name,
          currency: obj.currency,
          exchange: obj.exchange,
          mic_code: obj.mic_code,
          country: obj.country,
          type: obj.type,
          table_update_date: currentTime,
        },
      });
    }
    this.logger.log('update many complete');
  }

  async bulkInsertForexPair(inputs: rsp_forexpair[] | object[]): Promise<any> {
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

  private static createUnique(obj: object, properties: string[]): string {
    const propList: string[] = [];
    for (const prop of properties) {
      propList.push(obj[prop]);
    }
    return propList.join('_');
  }

  async bulkUpsertTableResponse(
    propertyList: string[],
    tableName: string,
    updateColumns: string[],
    rspData: any,
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

    const exists: object[] = [];
    const nonexist: object[] = [];

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
          await this.bulkInsertStocks(nonexist);
          break;
        case 'forexpair':
          await this.bulkInsertForexPair(nonexist);
          break;
        case 'cryptocurrency':
          await this.bulkInsertCryptoCurrency(nonexist);
          break;
        case 'etf':
          await this.bulkInsertETF(nonexist);
          break;
        case 'indice':
          await this.bulkInsertIndice(nonexist);
      }
    } else {
      this.logger.log('no new objects to update');
    }

    const uniqueKeyName = propertyList.join('_');

    for (const obj of exists) {
      const uniqueWhere = {};
      for (const prop of propertyList) {
        uniqueWhere[prop] = obj[prop];
      }

      const where = {};
      where[uniqueKeyName] = uniqueWhere;

      const data = {};
      for (const column of updateColumns) {
        data[column] = obj[column];
      }

      await this.prisma[tableName].update({
        where: where,
        data: data,
      });
    }
    this.logger.log('upsert completed');
  }

  // TODO: Convert all bulk Upsert functions to strategy method
  async bulkUpsertForexPair(inputs: rsp_forexpair[]): Promise<any> {
    const currentTime = new Date();
    const forexpairHashMap: Map<string, rsp_forexpair> = new Map();
    for (const obj of inputs) {
      const unique: string = [obj.symbol, obj.currency_base].join(',');
      forexpairHashMap.set(unique, obj);
    }

    const existsforexpair: rsp_forexpair[] = [];
    const nonexistsforexpair: rsp_forexpair[] = [];
    const db_resp = await this.prisma['forexpair'].findMany({
      select: {
        symbol: true,
        currency_base: true,
      },
    });

    this.logger.log('database retrieve complete');
    for (const obj of db_resp) {
      const unique = [obj.symbol, obj.currency_base].join(',');
      if (forexpairHashMap.has(unique)) {
        existsforexpair.push(forexpairHashMap.get(unique));
      } else {
        nonexistsforexpair.push(forexpairHashMap.get(unique));
      }
    }

    this.logger.log(`exists: ${existsforexpair.length}`);
    this.logger.log(`nonexists: ${nonexistsforexpair.length}`);
    this.logger.log('seperation complete');

    if (nonexistsforexpair.length > 0) {
      await this.bulkInsertForexPair(nonexistsforexpair);
      this.logger.log('bulk create complete');
    } else {
      this.logger.log('new stock empty');
    }

    for (const obj of existsforexpair) {
      await this.prisma.forexpair.update({
        where: {
          symbol_currency_base: {
            symbol: obj.symbol,
            currency_base: obj.currency_base,
          },
        },
        data: {
          symbol: obj.symbol,
          currency_group: obj.currency_group,
          currency_base: obj.currency_base,
          currency_quote: obj.currency_quote,
          table_update_date: currentTime,
        },
      });
    }
    this.logger.log('update many complete');
  }

  async bulkInsertCryptoCurrency(
    inputs: rsp_cryptocurrency[] | object[],
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

  async bulkUpsertCryptoCurrency(inputs: rsp_cryptocurrency[]): Promise<any> {
    const currentTime = new Date();
    return await this.prisma.$transaction(
      inputs.map((crypto) =>
        this.prisma.cryptocurrency.upsert({
          where: {
            symbol_currency_base: {
              symbol: crypto.symbol,
              currency_base: crypto.currency_base,
            },
          },
          update: {
            symbol: crypto.symbol,
            available_exchange: crypto.available_exchanges.toString(),
            currency_base: crypto.currency_base,
            currency_quote: crypto.currency_quote,
            table_update_date: currentTime,
          },
          create: {
            symbol: crypto.symbol,
            available_exchange: crypto.available_exchanges.toString(),
            currency_base: crypto.currency_base,
            currency_quote: crypto.currency_quote,
            latest_date: currentTime,
            oldest_date: currentTime,
            ishistorydatafinished: false,
            table_update_date: currentTime,
          },
        }),
      ),
    );
  }

  async bulkInsertETF(inputs: rsp_etf[] | object[]): Promise<any> {
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
      };
    });

    return await this.prisma.etf
      .createMany({
        data: data,
      })
      .catch((d) => this.logger.error(d));
  }

  async bulkUpsertETF(inputs: rsp_etf[]): Promise<any> {
    const currentTime = new Date();
    return await this.prisma.$transaction(
      inputs.map((etf) =>
        this.prisma.etf.upsert({
          where: {
            symbol_mic_code: {
              symbol: etf.symbol,
              mic_code: etf.mic_code,
            },
          },
          update: {
            symbol: etf.symbol,
            name: etf.name,
            currency: etf.currency,
            exchange: etf.exchange,
            mic_code: etf.mic_code,
            country: etf.country,
            table_update_date: currentTime,
          },
          create: {
            symbol: etf.symbol,
            name: etf.name,
            currency: etf.currency,
            exchange: etf.exchange,
            mic_code: etf.mic_code,
            country: etf.country,
            latest_date: currentTime,
            oldest_date: currentTime,
            ishistorydatafinished: false,
            table_update_date: currentTime,
          },
        }),
      ),
    );
  }

  async bulkInsertIndice(inputs: rsp_indices[] | object[]): Promise<any> {
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
      };
    });

    return await this.prisma.indices
      .createMany({
        data: data,
      })
      .catch((d) => this.logger.error(d));
  }

  async bulkUpsertIndice(inputs: rsp_indices[] | object[]): Promise<any> {
    const currentTime = new Date();
    return await this.prisma.$transaction(
      inputs.map((indice) =>
        this.prisma.indices.upsert({
          where: {
            symbol_country: {
              symbol: indice.symbol,
              country: indice.country,
            },
          },
          update: {
            symbol: indice.symbol,
            name: indice.name,
            country: indice.country,
            currency: indice.currency,
            table_update_date: currentTime,
          },
          create: {
            symbol: indice.symbol,
            name: indice.name,
            country: indice.country,
            currency: indice.currency,
            latest_date: currentTime,
            oldest_date: currentTime,
            ishistorydatafinished: false,
            table_update_date: currentTime,
          },
        }),
      ),
    );
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
    this.client.query(query, (err, res) => {
      if (err) {
        this.logger.log(err);
      }
    });
  }

  // input data format : symbol, datetime, open, high, low, close, volume
  async insertTableData(tableName: string, data: string[]): Promise<void> {
    const dataTableName = tableName + 'data';
    const d = [data];
    const query = format(
      `INSERT INTO ${dataTableName} (symbol, record_date_time, open, high, low, close, volume) VALUES %L`,
      d,
    );
    this.client.query(query, (err, res) => {
      if (err) {
        this.logger.log(err);
      }
    });
  }
}
