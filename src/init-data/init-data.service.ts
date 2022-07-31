import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client } from 'pg';
import settings from 'src/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { RmdbService } from 'src/rmdb/rmdb.service';
import { util } from 'src/util/util';
const fs = require('fs');
import { exec } from 'child_process';
import { TwelveDataService } from 'src/third-party/twelve-data/twelve-data.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class initDataService implements OnModuleInit {
  logger = new Logger(initDataService.name);

  async onModuleInit(): Promise<void> {
    const scriptPath = settings.startScript['path'];

    await this.testDBConnection();

    await this.fillSymbol();

    this.logger.log(`The module has been initialized.`);
  }

  /**
   * filled up with initial data list
   */
  async fillSymbol(): Promise<void> {
    const waitTime = 1000; // ms
    const rmdbService = new RmdbService(new PrismaService());
    const twelveDataService = new TwelveDataService(new HttpService());
    const symbol = new symbolService(twelveDataService, rmdbService);
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
  constructor(
    private readonly twelveDataService: TwelveDataService,
    private readonly rmdbService: RmdbService,
  ) {}

  async getInitStocks(): Promise<void> {
    const row_count = await this.rmdbService.getRowCount('stocks');
    if (row_count > 0) {
      this.logger.log('stocks data exists, skip');
    } else {
      const data = await this.twelveDataService.allStocks();
      await this.rmdbService.bulkInsertStocks(data);
      this.logger.log('stocks symbol initialized.');
    }
  }

  async getInitForexPair(): Promise<void> {
    const row_count = await this.rmdbService.getRowCount('forexpair');
    if (row_count > 0) {
      this.logger.log('forexpair data exists, skip');
    } else {
      const data = await this.twelveDataService.allForexPair();
      await this.rmdbService.bulkInsertForexPair(data);
      this.logger.log('forexpair symbol initialized.');
    }
  }

  async getInitCryptoCurrency(): Promise<void> {
    const row_count = await this.rmdbService.getRowCount('cryptocurrency');
    if (row_count > 0) {
      this.logger.log('cryptocurrency data exists, skip');
    } else {
      const data = await this.twelveDataService.allCryptoCurrency();
      await this.rmdbService.bulkInsertCryptoCurrency(data);
      this.logger.log('cryptocurrency symbol initialized.');
    }
  }

  async getInitETF(): Promise<void> {
    const row_count = await this.rmdbService.getRowCount('etf');
    if (row_count > 0) {
      this.logger.log('etf data exists, skip');
    } else {
      const data = await this.twelveDataService.allETF();
      await this.rmdbService.bulkInsertETF(data);
      this.logger.log('etf symbol initialized.');
    }
  }

  async getInitIndice(): Promise<void> {
    const row_count = await this.rmdbService.getRowCount('indices');
    if (row_count > 0) {
      this.logger.log('indice data exists, skip');
    } else {
      const data = await this.twelveDataService.allIndices();
      await this.rmdbService.bulkInsertIndice(data);
      this.logger.log('indice symbol initialized.');
    }
  }
}
