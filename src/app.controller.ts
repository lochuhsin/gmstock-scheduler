import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { twelvedata } from './api/twelveData';
import { rmdb } from './dao/rmdb';
import settings from './config';

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
    console.log(settings.postgres['port']);
    return 200;
  }
}
