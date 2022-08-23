import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { UpdateInfoService } from 'src/update-info/update-info.service';
import { MongodbService } from 'src/mongodb/mongodb.service';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly updateService: UpdateInfoService,
    private readonly mongodbService: MongodbService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('initCollections')
  async initCollections(): Promise<void> {
    await this.mongodbService.initCollections();
  }

  @Get('collectionCount')
  async getCollectionCount(): Promise<number> {
    return this.mongodbService.getCollectionCount();
  }

  @Get('triggerDailySymbolTaskInit')
  async triggerDailySymbolTaskInit() {
    await this.updateService.initDailySymbolTasks();
    return 'ok';
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
