import { Injectable } from '@nestjs/common';
import { RmdbService } from 'src/rmdb/rmdb.service';
import { TwelveData } from 'src/third_party/twelveData';

@Injectable()
export class TestService {
  constructor(private readonly rmdbService: RmdbService) {}

  async test() {
    const data = await TwelveData.allStocks();
    return await this.rmdbService.bulkInsertStocks(data.slice(0, 5));
  }
}
