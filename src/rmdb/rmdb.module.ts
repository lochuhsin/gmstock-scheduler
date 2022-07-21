import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RmdbService } from './rmdb.service';

@Module({
  exports: [RmdbService, PrismaModule],
  providers: [RmdbService],
})
export class RmdbModule { }
