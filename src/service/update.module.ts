import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UpdateService } from './update.service';

@Module({
  providers: [UpdateService, PrismaService],
})
export class UpdateModule {}
