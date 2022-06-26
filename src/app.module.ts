import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/task-test.module';
import { initDataModule } from './service/initData.module';

@Module({
  imports: [ScheduleModule.forRoot(), TasksModule, initDataModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {};
