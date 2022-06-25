import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { twelvedata } from './third_party/twelveData';
import { rmdb } from './dao/rmdb';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log(process.env.TEST);
    return this.appService.getHello();
  }

  @Get('test')
  async testing(): Promise<number> {
    const db = new rmdb.postgres();
    const data = await twelvedata.allStockList();
    db.bulkInsertStockList(data);
    return 200;
  }
}
