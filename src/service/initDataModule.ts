import { Module } from '@nestjs/common';
import { initDataService } from './initData.service';

@Module({
  providers: [initDataService],
})
export class InitDataModule {}
