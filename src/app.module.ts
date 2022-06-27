import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/task-test.module';
import { InitDataModule } from './service/initDataModule';
import { UpdateModule } from './service/update.module';
import { UpdateService } from './service/update.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TasksModule,
    InitDataModule,
    UpdateModule,
  ],
  controllers: [AppController],
  providers: [AppService, UpdateService],
})

export class AppModule {}

