import { Module } from '@nestjs/common';
import { RmdbModule } from 'src/rmdb/rmdb.module';
import { initDataService } from './initData.service';

@Module({
  imports:[RmdbModule],
  providers: [initDataService],
})
export class InitDataModule {}
