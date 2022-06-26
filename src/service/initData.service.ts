import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { rmdb } from '../dao/rmdb';
import { twelveData } from '../third_party/twelveData';
import settings from '../config';
import { Client } from 'pg';
const fs = require('fs');
import { exec } from 'child_process';

@Injectable()
export class initDataService implements OnApplicationBootstrap {
  logger = new Logger(initDataService.name);
  async onApplicationBootstrap(): Promise<void> {
    const scriptPath = settings.startScript['path'];

    // test postgres database connection
    await this.testDBConnection();

    // check start script
    this.checkStartScript(scriptPath);

    // exec migration script
    const linux_liked_os = ['linux', 'darwin'];
    if (linux_liked_os.includes(process.platform)) {
      // exec migration script
      await this.runMigration(scriptPath);
    } else {
      this.logger.log('Skip migration.');
    }
    // fill up all Symbol list
    await this.fillSymbol();

    // filled up with initial data list
    console.log(`The module has been initialized.`);
  }

  async fillSymbol(): Promise<string> {
    return new Promise((callback) => {});
  }

  async testDBConnection(): Promise<string> {
    return new Promise((callback) => {
      const client = new Client(settings.postgres);
      client.connect((err) => {
        if (err) {
          console.error('connection error', err.stack);
          console.log('Startup database connection failed, check db');
          process.exit(1);
        }
      });
      callback('ok!');
    });
  }

  checkStartScript(path: string): void {
    try {
      if (!fs.existsSync(path)) {
        console.log('startScript.sh not found');
        process.exit(1);
      }
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }

  async runMigration(path: string): Promise<string> {
    return new Promise((callback) => {
      exec('sh ' + path, (error, stdout, stderr) => {
        console.log(stdout);
        if (error !== null) {
          console.log(`exec error: ${error}`);
          return;
        }
        callback('Script finished success');
      });
    });
  }
}

@Injectable()
export class testService {
  pgDatabase = new rmdb.postgres();

  async getInitStocks(): Promise<void> {
    const data = await twelveData.allStocks();
    this.pgDatabase.bulkInsertStocks(data);
  }

  async getInitForexPair(): Promise<void> {
    const data = await twelveData.allForexPair();
    this.pgDatabase.bulkInsertForexPair(data);
  }

  async getInitCryptoCurrency(): Promise<void> {
    const data = await twelveData.allCryptoCurrency();
    this.pgDatabase.bulkInsertCryptoCurrency(data);
  }

  async getInitETF(): Promise<void> {
    const data = await twelveData.allETF();
    this.pgDatabase.bulkInsertETF(data);
  }

  async getInitIndice(): Promise<void> {
    const data = await twelveData.allIndices();
    this.pgDatabase.bulkInsertIndice(data);
  }
}
