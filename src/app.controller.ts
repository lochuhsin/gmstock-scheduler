import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { TwelveData } from './third_party/twelveData';
import { rmdb } from './dao/rmdb';
import { UpdateService } from './service/update.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly updateService: UpdateService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  async testing(): Promise<number> {
    // const db = new rmdb.postgres();
    // const test = await db.getSymbol('stocks');
    // console.log(test);
    this.updateService.initSymbolQueue();
    return 200;
  }
}
