import { Module } from '@nestjs/common';
import { initDataService } from './init-data.service';

@Module({
  providers: [initDataService],
})
export class InitDataModule {}
