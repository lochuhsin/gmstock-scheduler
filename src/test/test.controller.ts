import { Controller, Get } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
  constructor(private testService: TestService) {}

  @Get('test')
  async test() {
    return await this.testService.test();
  }
}
