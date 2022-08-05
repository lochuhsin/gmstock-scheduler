import { Controller, Get } from '@nestjs/common';
import { TwelveDataService } from 'src/third-party/twelve-data/twelve-data.service';
import { rsp_stocks } from '../dto/third_party/twelve_data/stocks';
import { RmdbService } from 'src/rmdb/rmdb.service';

@Controller('test')
export class TestController {
  constructor(
    private readonly twelveDataService: TwelveDataService,
    private readonly rmdbService: RmdbService,
  ) {}

  @Get('origin')
  async origin() {
    const stock: rsp_stocks[] = await this.twelveDataService.allStocks();
    await this.rmdbService.bulkUpsertStocks(stock);
    return 'ok';
  }

  @Get('test')
  async test() {
    const update: string[] = [
      'symbol',
      'name',
      'currency',
      'exchange',
      'mic_code',
      'country',
      'type',
    ];
    const stock: rsp_stocks[] = await this.twelveDataService.allStocks();
    await this.rmdbService.bulkUpsertTableResponse(
      ['symbol', 'mic_code'],
      'stocks',
      update,
      stock,
    );
    return 'ok';
  }
}
