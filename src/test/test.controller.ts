import { Controller, Get } from '@nestjs/common';
import { TwelveDataService } from 'src/third-party/twelve-data/twelve-data.service';

@Controller('test')
export class TestController {
  constructor(private readonly twelveDataService: TwelveDataService) {}

  @Get('test')
  async test() {
    console.log(
      await this.twelveDataService.timeSeries(
        'aapl',
        '2021-02-02 00:00:00',
        '2021-02-02 00:00:00',
      ),
    );
  }
}
