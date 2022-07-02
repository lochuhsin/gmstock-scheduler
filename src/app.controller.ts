import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

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
    // const test = await db.getSymbol('stocks');
    // console.log(test);
    // this.updateService.initSymbolQueue();
    return 200;
  }
}
