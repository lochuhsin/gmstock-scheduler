import { Module } from '@nestjs/common';
import { UpdateService } from '../service/update.service';
import { TasksService } from './task-test.service';
import { RmdbModule } from 'src/rmdb/rmdb.module';

@Module({
  imports: [RmdbModule],
  providers: [TasksService, UpdateService],
})
export class TasksModule {}
