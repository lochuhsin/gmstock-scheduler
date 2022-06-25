import { Client } from 'pg';
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

    bulkInsertStockList(inputs: any): void {
      const arr = [];
      for (const obj of inputs) {
        const obj_arr: string[] = [
          obj['symbol'],
          obj['name'],
          obj['currency'],
          obj['exchange'],
          obj['mic_code'],
          obj['country'],
        ];
        arr.push(obj_arr);
      }
      const query = format(
        'INSERT INTO stocklist (symbol, name, currency, exchange, mic_code, country) VALUES %L',
        arr,
      );

      this.client.query(query, (err, res) => {
        if (err) throw err;
        console.log(res);
      });
    }
  }
}
