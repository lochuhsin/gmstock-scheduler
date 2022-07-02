import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { rmdb } from '../dao/rmdb';
import { TwelveData } from '../third_party/twelveData';
import { exec } from 'child_process';
import settings from '../config';
import { Client } from 'pg';
const fs = require('fs');
import { util } from '../util/util';

@Injectable()
export class initDataService implements OnModuleInit {
  logger = new Logger(initDataService.name);

  async onModuleInit(): Promise<void> {
    const scriptPath = settings.startScript['path'];

    await this.testDBConnection();

    this.checkStartScript(scriptPath);
    await this.migration(scriptPath);
    await this.fillSymbol();

    this.logger.log(`The module has been initialized.`);
  }

  async migration(scriptPath: string): Promise<void> {
    const linux_liked_os = ['linux', 'darwin'];
    if (linux_liked_os.includes(process.platform)) {
      // exec migration script
      await this.runMigration(scriptPath);
    } else {
      this.logger.log('Skip migration.');
    }
  }

  /**
   * filled up with initial data list
   */
  async fillSymbol(): Promise<void> {
    const waitTime = 1000; // ms
    const symbol = new symbolService();
    const func_arr = [
      symbol.getInitStocks.bind(symbol),
      symbol.getInitForexPair.bind(symbol),
      symbol.getInitCryptoCurrency.bind(symbol),
      symbol.getInitETF.bind(symbol),
      symbol.getInitIndice.bind(symbol),
    ];
    for (const func of func_arr) {
      await func();
      await util.sleep(waitTime);
    }
  }

  async testDBConnection(): Promise<string> {
    return new Promise((callback) => {
      const client = new Client(settings.postgres);
      client.connect((err) => {
        if (err) {
          this.logger.error('connection error', err.stack);
          this.logger.log('Startup database connection failed, check db');
          process.exit(1);
        }
      });
      callback('ok!');
      this.logger.log('database connection successful');
    });
  }

  checkStartScript(path: string): void {
    try {
      if (!fs.existsSync(path)) {
        this.logger.log('startScript.sh not found');
        process.exit(1);
      }
    } catch (err) {
      this.logger.error(err);
      process.exit(1);
    }
    this.logger.log('script detected');
  }

  async runMigration(path: string): Promise<string> {
    return new Promise((callback) => {
      exec('sh ' + path, (error, stdout, stderr) => {
        this.logger.log(stdout);
        if (error !== null) {
          this.logger.log(`exec error: ${error}`);
          return;
        }
        callback('Script finished success');
        this.logger.log('migration finished');
      });
    });
  }
}

export class symbolService {
  public readonly logger = new Logger(initDataService.name);
  private readonly pgDatabase = new rmdb.postgres();

  async getInitStocks(): Promise<void> {
    const row_count = await this.pgDatabase.getRowCount('stocks');
    if (row_count > 0) {
      this.logger.log('stocks data exists, skip');
    } else {
      const data = await TwelveData.allStocks();
      await this.pgDatabase.bulkInsertStocks(data);
      this.logger.log('stocks symbol initialized.');
    }
  }

  async getInitForexPair(): Promise<void> {
    const row_count = await this.pgDatabase.getRowCount('forexpair');
    if (row_count > 0) {
      this.logger.log('forexpair data exists, skip');
    } else {
      const data = await TwelveData.allForexPair();
      await this.pgDatabase.bulkInsertForexPair(data);
      this.logger.log('forexpair symbol initialized.');
    }
  }

  async getInitCryptoCurrency(): Promise<void> {
    const row_count = await this.pgDatabase.getRowCount('cryptocurrency');
    if (row_count > 0) {
      this.logger.log('cryptocurrency data exists, skip');
    } else {
      const data = await TwelveData.allCryptoCurrency();
      await this.pgDatabase.bulkInsertCryptoCurrency(data);
      this.logger.log('cryptocurrency symbol initialized.');
    }
  }

  async getInitETF(): Promise<void> {
    const row_count = await this.pgDatabase.getRowCount('etf');
    if (row_count > 0) {
      this.logger.log('etf data exists, skip');
    } else {
      const data = await TwelveData.allETF();
      await this.pgDatabase.bulkInsertETF(data);
      this.logger.log('etf symbol initialized.');
    }
  }

  async getInitIndice(): Promise<void> {
    const row_count = await this.pgDatabase.getRowCount('indices');
    if (row_count > 0) {
      this.logger.log('indice data exists, skip');
    } else {
      const data = await TwelveData.allIndices();
      await this.pgDatabase.bulkInsertIndice(data);
      this.logger.log('indice symbol initialized.');
    }
  }
}
