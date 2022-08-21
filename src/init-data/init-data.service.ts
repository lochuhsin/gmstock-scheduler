import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client } from 'pg';
import settings from 'src/config';
import { MongodbService } from 'src/mongodb/mongodb.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RmdbService } from 'src/rmdb/rmdb.service';
import { util } from 'src/util/util';
import { TwelveDataService } from 'src/third-party/twelve-data/twelve-data.service';
import { HttpService } from '@nestjs/axios';
import * as mongoose from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class initDataService implements OnModuleInit {
  logger = new Logger(initDataService.name);

  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async onModuleInit(): Promise<void> {
    this.logger.log('start checking postgres db');
    await this.testDBConnection();

    this.logger.log('start filling symbols');
    await this.fillSymbol();

    this.logger.log('start checking mongodb database existence');
    await this.checkMongoDatabase();

    this.logger.log(`The module has been initialized.`);
  }
  private async checkMongoDatabase(): Promise<void> {
    const mongoService = new MongodbService(this.connection);
    await mongoService.initCollections();
    if (!mongoService.isDataBaseExist()) {
      this.logger.log('TimeSeries database not exist, creating one');
      await mongoService.createInitDatabase();
    }
    this.logger.log('Mongo check complete');
  }

  /**
   * filled up with initial data list
   */
  private async fillSymbol(): Promise<void> {
    this.logger.log(`start filling init symbols`);
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
