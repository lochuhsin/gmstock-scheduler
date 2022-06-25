import { Client } from 'pg';
import { rsp_stocks } from 'src/dto/third_party/twelve_data/stocks';
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

    bulkInsertStockList(inputs: rsp_stocks[]): void {
      const data = inputs.map((d) => [
        d.symbol,
        d.name,
        d.currency,
        d.exchange,
        d.mic_code,
        d.country,
      ]);
      const query = format(
        'INSERT INTO stock_list (symbol, name, currency, exchange, mic_code, country) VALUES %L',
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
