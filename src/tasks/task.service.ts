import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UpdateInfoService } from 'src/update-info/update-info.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private readonly updateService: UpdateInfoService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async initializeTaskQue() {
    this.logger.log(
      `left api count: ${this.updateService.getCurrentAPICount()}`,
    );

    this.updateService.initApiCount();
    this.logger.log('ApiCount initialized');

    await this.updateService.initSymbolTasks();
    this.logger.log('Symbol tasks initialized');
  }

  @Cron('*/2 * * * * *')
  async runTasks(): Promise<void> {
    await this.updateService.runSymbolTasks();
  }

  @Cron('0 0 0 1 * *') // update every month
  async updateSymbolTable(): Promise<void> {
    this.logger.log(
      `Start updating symbol tables, current time: ${new Date()}`,
    );
    await this.updateService.updateSymbolTables();
    this.logger.log(`Update finished at: ${new Date()}`);
  }

  @Cron('0 */30 * * * *')
  async systemHealthCheck(): Promise<void> {
    this.logger.log(`[Heart Beat per 30 min] system still alive`);
  }
}
