import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { twelveData } from './third_party/twelveData';
import { rmdb } from './dao/rmdb';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  async testing(): Promise<number> {
    const db = new rmdb.postgres();
    // const data = await twelveData.allStocksTest();
    // console.log(data);
    const data = await twelveData.timeSeries(
      'AAPL',
      '2022-06-01',
      '2022-06-20',
    );
    console.log(data);
    return 200;
  }
}
