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

    bulkInsertStocks(inputs: rsp_stocks[]): void {
      const data = inputs.map((d) => [
        d.symbol,
        d.name,
        d.currency,
        d.exchange,
        d.mic_code,
        d.country,
        d.type,
      ]);
      const query = format(
        'INSERT INTO stocks (symbol, name, currency, exchange, mic_code, country, type) VALUES %L',
        data,
      );

      this.client.query(query, (err, res) => {
        if (err) {
          console.log(res);
        }
      });
    }
    bulkInsertForexPair(inputs: rsp_forexpair[]): void {
      const data = inputs.map((d) => [
        d.symbol,
        d.currency_group,
        d.currency_base,
        d.currency_quote,
      ]);
      const query = format(
        'INSERT INTO forexpair (symbol, currency_group, currency_base, currency_quote) VALUES %L',
        data,
      );

      this.client.query(query, (err, res) => {
        if (err) {
          console.log(res);
        }
      });
    }
    bulkInsertCryptoCurrency(inputs: rsp_cryptocurrency[]): void {
      const data = inputs.map((d) => [
        d.symbol,
        d.available_exchanges.toString(),
        d.currency_base,
        d.currency_quote,
      ]);
      const query = format(
        'INSERT INTO cryptocurrency (symbol, available_exchange, currency_base, currency_quote) VALUES %L',
        data,
      );

      this.client.query(query, (err, res) => {
        if (err) {
          console.log(res);
        }
      });
    }
    bulkInsertETF(inputs: rsp_etf[]): void {
      const data = inputs.map((d) => [
        d.symbol,
        d.name,
        d.currency,
        d.exchange,
        d.mic_code,
        d.country,
      ]);
      const query = format(
        'INSERT INTO etf (symbol, name, currency, exchange, mic_code, country) VALUES %L',
        data,
      );

      this.client.query(query, (err, res) => {
        if (err) {
          console.log(res);
        }
      });
    }
    bulkInsertIndice(inputs: rsp_indices[]): void {
      const data = inputs.map((d) => [
        d.symbol,
        d.name,
        d.country,
        d.currency,
      ]);
      console.log(data);
      const query = format(
        'INSERT INTO indices (symbol, name, country, currency) VALUES %L',
        data,
      );

      this.client.query(query, (err, res) => {
        if (err) {
          console.log(res);
        }
      });
    }
  }
}
