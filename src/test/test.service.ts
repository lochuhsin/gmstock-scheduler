import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class TestService {
  constructor(private prisma: PrismaService) {}
  
  async test() {
    return await this.prisma.etf.count();
  }
}
