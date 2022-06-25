import { Client } from 'pg';
const format = require('pg-format');
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace rmdb {
  export class postgres {
    dbConfig = {
      user: 'root',
      password: 'root',
      database: 'postgres',
      host: 'localhost',
      port: 5432,
    };

    client = null;
    constructor() {
      this.client = new Client(this.dbConfig);
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
        'INSERT INTO stock_list (symbol, name, currency, exchange, mic_code, country) VALUES %L',
        arr,
      );

      this.client.query(query, (err, res) => {
        if (err) {
          console.log(res);
        }
      });
    }
  }
}
