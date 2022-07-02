import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/task-test.module';
import { InitDataModule } from './service/initData.module';
import { UpdateModule } from './service/update.module';
import { UpdateService } from './service/update.service';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TasksModule,
    InitDataModule,
    UpdateModule,
  ],
  controllers: [AppController],
  providers: [AppService, UpdateService, PrismaClient],
})

export class AppModule {}
