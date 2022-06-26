import { Module } from '@nestjs/common';
import { UpdateService } from './update.service';

@Module({
  providers: [UpdateService],
})
export class UpdateModule {}
