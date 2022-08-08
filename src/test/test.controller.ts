import { Controller, Get, Logger } from '@nestjs/common';
import { TwelveDataService } from 'src/third-party/twelve-data/twelve-data.service';
import * as mongoose from 'mongoose';
import { util } from '../util/util';
import { InjectConnection } from '@nestjs/mongoose';

@Controller('test')
export class TestController {
  constructor(
    private readonly twelveDataService: TwelveDataService,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}
  logger = new Logger(TestController.name);

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
  test() {
    this.connection.useDb('test').collection('test').insertOne({ abc: 123 });
  }
}
