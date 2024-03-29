import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/task.module';
import { TestController } from './test/test.controller';
import { TestService } from './test/test.service';
import { RmdbModule } from './rmdb/rmdb.module';
import { InitDataModule } from './init-data/init-data.module';
import { ThirdPartyModule } from './third-party/third-party.module';
import { UpdateInfoModule } from './update-info/update-info.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongodbModule } from './mongodb/mongodb.module';
import settings from './config';

@Module({
  imports: [
    MongooseModule.forRoot(settings.mongodb.mongoConn),
    ScheduleModule.forRoot(),
    TasksModule,
    InitDataModule,
    UpdateInfoModule,
    RmdbModule,
    ThirdPartyModule,
    UpdateInfoModule,
    MongodbModule,
  ],
  controllers: [AppController, TestController],
  providers: [AppService, TestService],
})
export class AppModule {}
