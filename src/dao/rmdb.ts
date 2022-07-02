import { Client } from 'pg';
import {
  rsp_stocks,
  rsp_forexpair,
  rsp_cryptocurrency,
  rsp_etf,
  rsp_indices,
} from 'src/dto/third_party/twelve_data/stocks';
import { util } from '../util/util';
const format = require('pg-format');
import settings from '../config';
import { db_rsp_symboltask } from '../dto/database/dbresponse';
import { PrismaService } from 'src/service/prisma.service';
import { Logger } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace rmdb {
  export class postgres {
    client = null;
    logger = new Logger(postgres.name);

    constructor(private readonly prisma: PrismaService) {
      this.client = new Client(settings.postgres);
      this.client.connect((err) => {
        if (err) {
          console.error('connection error', err.stack);
        } else {
          console.log('connected');
        }
      });
    }
    async getRowCount(tableName: string): Promise<number> {
      return await this.prisma[tableName].count();
    }

    async getSymbolTask(tableName: string): Promise<db_rsp_symboltask[]> {
      return await this.prisma[tableName].findMany({
        select: {
          symbol: true,
          latest_date: true,
          oldest_date: true,
          ishistorydatafinished: true,
        },
      });
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
    bulkInsertTableData(tableName: string, data: string[][]) {
      const query = format(
        `INSERT INTO ${tableName} (symbol, record_date_time, open, high, low, close, volume) VALUES %L`,
        data,
      );
      this.client.query(query, (err, res) => {
        if (err) {
          console.log(err);
        }
      });
    }

    // input data format : symbol, datetime, open, high, low, close, volume
    insertTableData(tableName: string, data: string[]) {
      const d = [data];
      const query = format(
        `INSERT INTO ${tableName} (symbol, record_date_time, open, high, low, close, volume) VALUES %L`,
        d,
      );
      this.client.query(query, (err, res) => {
        if (err) {
          console.log(err);
        }
      });
    }
  }
}
