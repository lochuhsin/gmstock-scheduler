import { Module } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';

@Module({
    exports: [PrismaService],
    providers: [PrismaService]
})
export class PrismaModule { }
