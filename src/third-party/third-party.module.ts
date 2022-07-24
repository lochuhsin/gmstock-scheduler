import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FinMindService } from './fin-mind/fin-mind.service';
import { TwelveDataService } from './twelve-data/twelve-data.service';

@Module({
  imports: [HttpModule],
  exports: [FinMindService, TwelveDataService],
  providers: [FinMindService, TwelveDataService],
})
export class ThirdPartyModule {}
