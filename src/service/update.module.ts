import { Module } from '@nestjs/common';
import { RmdbModule } from 'src/rmdb/rmdb.module';
import { UpdateService } from './update.service';

@Module({
  imports: [RmdbModule],
  providers: [UpdateService],
})
export class UpdateModule {}
