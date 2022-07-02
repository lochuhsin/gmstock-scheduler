import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
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
}
