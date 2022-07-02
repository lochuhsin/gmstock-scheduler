import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TwelveData } from 'src/third_party/twelveData';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_10_HOURS)
  async SampleJob() {
    this.logger.debug('OMG!!! It\'s cronjob!!');
  }
}
