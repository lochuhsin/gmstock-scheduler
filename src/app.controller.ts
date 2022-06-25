import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { finMind } from './third_party/finMind';
import { twelvedata } from './third_party/twelveData';
import {rmdb} from './dao/rmdb'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  async testing(): Promise<number> {
    const test = new rmdb.postgres();
    const data = await twelvedata.allStock();
    test.bulkInsertStockList(data['data']['data']);
    return 200;
  }
}
