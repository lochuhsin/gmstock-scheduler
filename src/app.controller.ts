import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { UpdateInfoService } from 'src/update-info/update-info.service';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly updateService: UpdateInfoService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('triggerSymbolTableUpdate')
  async triggerSymbolTableUpdate(): Promise<string> {
    await this.updateService.updateSymbolTables();
    return 'ok';
  }

  @Get('triggerSymbolTaskInit')
  async triggerSymbolTaskInit(): Promise<string> {
    await this.updateService.initSymbolTasks();
    return 'ok';
  }

  @Get('getSymbolTaskStatus')
  getSymbolTaskStatus(): object {
    return this.updateService.getSymbolTaskCount();
  }

  @Get('getCurrentAPICount')
  getCurrentAPICount(): number {
    return this.updateService.getCurrentAPICount();
  }

  @Get('initCurrentAPICount')
  postUpdateCurrentAPICount(): number {
    this.updateService.initApiCount();
    return this.updateService.getCurrentAPICount();
  }

  @Post('clearTaskQue')
  postClearTaskQue(): object {
    return this.updateService.clearTaskQueue();
  }
}
