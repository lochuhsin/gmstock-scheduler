import { Module } from '@nestjs/common';
import { RmdbModule } from 'src/rmdb/rmdb.module';
import { ThirdPartyModule } from 'src/third-party/third-party.module';
import { UpdateInfoService } from './update-info.service';
import { MongodbModule } from 'src/mongodb/mongodb.module';

@Module({
  imports: [ThirdPartyModule, RmdbModule, MongodbModule],
  exports: [UpdateInfoService],
  providers: [UpdateInfoService],
})
export class UpdateInfoModule {}
