import { Injectable } from '@nestjs/common';
import { RmdbService } from 'src/rmdb/rmdb.service';
import { TwelveDataService } from 'src/third-party/twelve-data/twelve-data.service';

@Injectable()
export class TestService {
  constructor(
    private readonly twelveDataService: TwelveDataService,
    private readonly rmdbService: RmdbService,
  ) {}

  async test() {
    const data = await this.twelveDataService.allStocks();
    return await this.rmdbService.bulkInsertStocks(data.slice(0, 5));
  }
}
