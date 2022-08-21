import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RmdbService } from './rmdb.service';

@Module({
  imports: [PrismaModule],
  exports: [RmdbService],
  providers: [RmdbService],
})
export class RmdbModule {}
