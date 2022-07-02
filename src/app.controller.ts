import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { rmdb } from './dao/rmdb';
import { TwelveData } from './third_party/twelveData';
import { util } from './util/util';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  async testing(): Promise<number> {
    // const db = new rmdb.postgres();
    //
    // let result = await TwelveData.timeSeries('AAPL', '2022-06-01', '2022-07-01');
    // result.shift();
    // const new_result = result.map((arr) => {
    //   arr.unshift('AAPL');
    //   return arr;
    // });
    // console.log(new_result);
    // await db.bulkInsertTableData('stocksdata', result);
    return 200;
  }
}
