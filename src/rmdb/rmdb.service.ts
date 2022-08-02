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
    const res =  await this.prisma[tableName].findMany({
      select: {
        id: true,
        symbol: true,
        latest_date: true,
        oldest_date: true,
        ishistorydatafinished: true,
      },
    });

    return res.map((obj) => {
      obj['table_name'] = tableName;
      return obj;
    })
  }

  async updateLatestDate(tableName: string, id: number, date: Date): Promise<void> {
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
  async updateOldestDate(tableName: string, id: number, date: Date): Promise<void> {
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

  async bulkInsertStocks(inputs: rsp_stocks[]): Promise<any> {
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
      };
    });

    return await this.prisma.stocks
      .createMany({
        data: data,
      })
      .catch((d) => this.logger.error(d));
  }

  async bulkUpsertStocks(inputs: rsp_stocks[]): Promise<any> {
    const currentTime = new Date();

    return await this.prisma.$transaction(
      inputs.map((stock) =>
        this.prisma.stocks.upsert({
          where: {
            symbol: stock.symbol,
            country: stock.country,
          },
          update: {
            name: stock.name,
            currency: stock.currency,
            exchange: stock.exchange,
            mic_code: stock.mic_code,
            country: stock.country,
            type: stock.type,
            ishistorydatafinished: false,
          },
          create: {
            symbol: stock.symbol,
            name: stock.name,
            currency: stock.currency,
            exchange: stock.exchange,
            mic_code: stock.mic_code,
            country: stock.country,
            type: stock.type,
            latest_date: currentTime,
            oldest_date: currentTime,
            ishistorydatafinished: false,
          },
        })
      ))
    );
  }

  async bulkInsertForexPair(inputs: rsp_forexpair[]): Promise<any> {
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
      };
    });

    return await this.prisma.forexpair
      .createMany({
        data: data,
      })
      .catch((d) => this.logger.error(d));
  }

  async bulkInsertCryptoCurrency(inputs: rsp_cryptocurrency[]): Promise<any> {
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
      };
    });

    return await this.prisma.cryptocurrency
      .createMany({
        data: data,
      })
      .catch((d) => this.logger.error(d));
  }

  async bulkInsertETF(inputs: rsp_etf[]): Promise<any> {
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
      };
    });

    return await this.prisma.etf
      .createMany({
        data: data,
      })
      .catch((d) => this.logger.error(d));
  }

  async bulkInsertIndice(inputs: rsp_indices[]): Promise<any> {
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
