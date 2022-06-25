import { Client } from 'pg';
import { rsp_stocks } from 'src/dto/third_party/twelve_data/stocks';
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
