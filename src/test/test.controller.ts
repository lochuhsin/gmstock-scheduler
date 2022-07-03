import { Controller, Get } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { TwelveData } from 'src/third_party/twelveData';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
  constructor(private testService: TestService) {}

  @Get('test')
  async test() {
    console.log(
      await TwelveData.timeSeries(
        'aapl',
        '2021-02-02 00:00:00',
        '2021-02-02 00:00:00',
      ),
    );
  }
}
