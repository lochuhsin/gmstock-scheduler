import { Module } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { RmdbService } from './rmdb.service';

@Module({
  exports:[RmdbService],
  providers: [RmdbService, PrismaService],
})
export class RmdbModule {}
