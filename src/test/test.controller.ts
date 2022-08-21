import { Controller, Get, Logger } from '@nestjs/common';
import { TwelveDataService } from 'src/third-party/twelve-data/twelve-data.service';
import * as mongoose from 'mongoose';
import { util } from '../util/util';
import { InjectConnection } from '@nestjs/mongoose';
import { rsp_timeseries } from '../dto/third_party/twelve_data/data';

interface TestData {
  name: string;
}

@Controller('test')
export class TestController {
  constructor(
    private readonly twelveDataService: TwelveDataService,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}
  logger = new Logger(TestController.name);

  @Get('testtimeseries')
  async time() {
    const rsp: rsp_timeseries = await this.twelveDataService.testFunc(
      'AAPL',
      '1920-01-01',
      '1920-03-03',
    );
    console.log(rsp);

    if (rsp['status'] != 'ok') {
      console.log(rsp['message']);
      return rsp.message;
    }
    console.log(rsp['values']);
    return rsp['values'];
  }

  @Get('test1')
  async test1() {
    const endDate = new Date();
    const copyDate = new Date(endDate.valueOf());
    copyDate.setDate(copyDate.getDate() - 7000);
    console.log(copyDate);

    const end = util.convertDateToDateString(endDate);
    const start = util.convertDateToDateString(copyDate);

    const result: string[][] = await this.twelveDataService.testFunc(
      'AAPL',
      start,
      end,
    );
    return result.length;
  }

  @Get('dbtest')
  async test() {
    await this.connection
      .useDb('test')
      .collection('test')
      .insertOne({ abc: 123 });
    const client = this.connection.useDb('test');
    await client
      .collection('hello world collection')
      .insertOne({ abcde: 13245 });
    const res = await client.db.listCollections().toArray();
    for (const obj of res) {
      console.log(obj.name);
    }
  }

  @Get('dbtest2')
  async test2() {
    const t: TestData = { name: 'interface' };
    await this.connection.useDb('test').collection('test222').insertOne(t);
  }
}
