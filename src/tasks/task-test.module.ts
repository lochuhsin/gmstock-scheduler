import { Module } from '@nestjs/common';
import { TasksService } from './task-test.service';

@Module({
  providers: [TasksService],
})
export class TasksModule {}
