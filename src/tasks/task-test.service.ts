import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { twelveData } from 'src/third_party/twelveData';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_SECOND)
  async SampleJob() {
    this.logger.debug('Called when the current second is 1');
  }
}
