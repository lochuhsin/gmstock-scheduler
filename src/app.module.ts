import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/task-test.module';
import { InitDataModule } from './service/initData.module';
import { UpdateModule } from './service/update.module';
import { TestController } from './test/test.controller';
import { TestService } from './test/test.service';
import { RmdbModule } from './rmdb/rmdb.module';
import { UpdateService } from './service/update.service';
import { PrismaModule } from './prisma/prisma.module';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    TasksModule,
    InitDataModule,
    UpdateModule,
    RmdbModule,
    PrismaModule,
  ],
  controllers: [AppController, TestController],
  providers: [AppService, UpdateService, TestService],
})
export class AppModule { }
