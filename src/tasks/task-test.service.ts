import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UpdateService } from 'src/service/update.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly updateService: UpdateService) {}

  @Cron(CronExpression.EVERY_10_HOURS)
  async SampleJob() {
    this.logger.debug("OMG!!! It's cronjob!!");
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async initializeTaskQue() {
    await this.updateService.initSymbolTasks();
  }

  @Cron('*/2 * * * * *')
  async RunTasks(): Promise<void> {
    await this.updateService.runSymbolTasks();
  }
}
