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

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace rmdb {
  export class postgres {
    client = null;

    constructor() {
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
      const query = `select count(symbol) from ${tableName}`;
      const result = await this.client.query(query);
      const row_count = result['rows'][0]['count'];
      return parseInt(row_count);
    }

    async getSymbolTask(tableName: string): Promise<db_rsp_symboltask[]> {
      const query = `select symbol, latest_date, oldest_date, ishistorydatafinished from ${tableName}`;
      const result = await this.client.query(query);
      return result['rows'].map((obj) => {
        obj.tableName = tableName;
        return obj;
      });
    }

    async bulkInsertStocks(inputs: rsp_stocks[]): Promise<void> {
      const currentTime = util.getCurrentDateTime();
      const data = inputs.map((d) => [
        d.symbol,
        d.name,
        d.currency,
        d.exchange,
        d.mic_code,
        d.country,
        d.type,
        currentTime,
        currentTime,
        false,
      ]);
      const query = format(
        'INSERT INTO stocks (symbol, name, currency, exchange, mic_code, country, type, latest_date, oldest_date, ishistorydatafinished) VALUES %L',
        data,
      );
      await this.client.query(query, (err, res) => {
        if (err) {
          console.log(err);
        }
      });
    }
    async bulkInsertForexPair(inputs: rsp_forexpair[]): Promise<void> {
      const currentTime = util.getCurrentDateTime();
      const data = inputs.map((d) => [
        d.symbol,
        d.currency_group,
        d.currency_base,
        d.currency_quote,
        currentTime,
        currentTime,
        false,
      ]);
      const query = format(
        'INSERT INTO forexpair (symbol, currency_group, currency_base, currency_quote, latest_date, oldest_date, ishistorydatafinished) VALUES %L',
        data,
      );

      await this.client.query(query, (err, res) => {
        if (err) {
          console.log(err);
        }
      });
    }
    async bulkInsertCryptoCurrency(
      inputs: rsp_cryptocurrency[],
    ): Promise<void> {
      const currentTime = util.getCurrentDateTime();
      const data = inputs.map((d) => [
        d.symbol,
        d.available_exchanges.toString(),
        d.currency_base,
        d.currency_quote,
        currentTime,
        currentTime,
        false,
      ]);
      const query = format(
        'INSERT INTO cryptocurrency (symbol, available_exchange, currency_base, currency_quote, latest_date, oldest_date, ishistorydatafinished) VALUES %L',
        data,
      );

      await this.client.query(query, (err, res) => {
        if (err) {
          console.log(err);
        }
      });
    }
    async bulkInsertETF(inputs: rsp_etf[]): Promise<void> {
      const currentTime = util.getCurrentDateTime();
      const data = inputs.map((d) => [
        d.symbol,
        d.name,
        d.currency,
        d.exchange,
        d.mic_code,
        d.country,
        currentTime,
        currentTime,
        false,
      ]);
      const query = format(
        'INSERT INTO etf (symbol, name, currency, exchange, mic_code, country, latest_date, oldest_date, ishistorydatafinished) VALUES %L',
        data,
      );
      await this.client.query(query, (err, res) => {
        if (err) {
          console.log(err);
        }
      });
    }
    async bulkInsertIndice(inputs: rsp_indices[]): Promise<void> {
      const currentTime = util.getCurrentDateTime();
      const data = inputs.map((d) => [
        d.symbol,
        d.name,
        d.country,
        d.currency,
        currentTime,
        currentTime,
        false,
      ]);
      const query = format(
        'INSERT INTO indices (symbol, name, country, currency, latest_date, oldest_date, ishistorydatafinished) VALUES %L',
        data,
      );

      await this.client.query(query, (err, res) => {
        if (err) {
          console.log(err);
        }
      });
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
