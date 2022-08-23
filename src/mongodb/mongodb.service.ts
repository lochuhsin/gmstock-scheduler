import { Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';
import settings from 'src/config';

import { InjectConnection } from '@nestjs/mongoose';
import { db_rsp_timeserise } from 'src/dto/database/dbresponse';

@Injectable()
export class MongodbService {
  private collections: Set<string> = new Set();
  private client;
  private dummyCollection = 'dummy';

  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {
    this.client = this.connection.useDb(settings.mongodb.database);
  }

  public async createInitDatabase() {
    // create the database if it doesn't exist
    await this.client
      .collection(this.dummyCollection)
      .insertOne({ dummy: 'dummy' });
  }

  public isDataBaseExist(): boolean {
    return this.collections.has(this.dummyCollection);
  }

  public async initCollections(): Promise<void> {
    const collection_objs = await this.client.db.listCollections().toArray();
    for (const obj of collection_objs) {
      this.collections.add(obj.name);
    }
  }

  public getCollectionCount(): number {
    return this.collections.size;
  }

  // collection name rule
  // stock_<symbol>_<mic_code>
  // forexpair_<symbol>_<currency_base>
  // cryptocurrency_<symbol>_<currency_base>
  // etf_<symbol>_<mic_code>
  // indices_<symbol>_<country>
  public async bulkInsertTimeSeries(
    collectionName: string,
    data: db_rsp_timeserise[],
  ): Promise<void> {
    await this.client.collection(collectionName).insertMany(data);
    if (!this.collections.has(collectionName)) {
      this.collections.add(collectionName);
    }
  }

  public async insertTimeSeries(
    collectionName: string,
    data: db_rsp_timeserise,
  ): Promise<void> {
    await this.client.collection(collectionName).insertOne(data);
    if (!this.collections.has(collectionName)) {
      this.collections.add(collectionName);
    }
  }

  public getAllCollections(): string[] {
    return [...this.collections.values()];
  }
}
