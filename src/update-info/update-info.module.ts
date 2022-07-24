import { Module } from '@nestjs/common';
import { RmdbModule } from 'src/rmdb/rmdb.module';
import { ThirdPartyModule } from 'src/third-party/third-party.module';
import { UpdateInfoService } from './update-info.service';

@Module({
  imports: [ThirdPartyModule, RmdbModule],
  exports: [UpdateInfoService],
  providers: [UpdateInfoService],
})
export class UpdateInfoModule {}
