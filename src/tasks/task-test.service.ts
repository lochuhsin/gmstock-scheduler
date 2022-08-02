import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UpdateInfoService } from 'src/update-info/update-info.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly updateService: UpdateInfoService) {}

  @Cron(CronExpression.EVERY_10_HOURS)
  async SampleJob() {
    this.logger.debug("OMG!!! It's cronjob!!");
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async initializeTaskQue() {
    const leftAPICount = this.updateService.getCurrentAPICount();
    this.logger.log(`left api count: ${leftAPICount}`);

    await this.updateService.initApiCount();
    this.logger.log('ApiCount initialized');

    await this.updateService.initSymbolTasks();
    this.logger.log('Symbol tasks initialized');
  }

  @Cron('*/2 * * * * *')
  async RunTasks(): Promise<void> {
    await this.updateService.runSymbolTasks();
  }
}
