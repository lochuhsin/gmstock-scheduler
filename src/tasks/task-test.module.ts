import { Module } from '@nestjs/common';
import { TasksService } from './task-test.service';
import { RmdbModule } from 'src/rmdb/rmdb.module';
import { ThirdPartyModule } from 'src/third-party/third-party.module';
import { UpdateInfoModule } from 'src/update-info/update-info.module';

@Module({
  imports: [ThirdPartyModule, RmdbModule, UpdateInfoModule],
  providers: [TasksService],
})
export class TasksModule {}
