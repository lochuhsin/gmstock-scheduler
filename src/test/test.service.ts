import { Injectable } from '@nestjs/common';
import { rmdb } from 'src/dao/rmdb';
import { PrismaService } from 'src/service/prisma.service';
import { TwelveData } from 'src/third_party/twelveData';

@Injectable()
export class TestService {
  constructor(private prisma: PrismaService) {}

  private readonly pgDatabase = new rmdb.postgres(this.prisma);
  async test() {
    const data = await TwelveData.allStocks();
    return await this.pgDatabase.bulkInsertStocks(data.slice(0, 5));
  }
}
