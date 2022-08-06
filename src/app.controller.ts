import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UpdateInfoService } from 'src/update-info/update-info.service';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly updateService: UpdateInfoService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('triggerSymbolUpdate')
  async triggerSymbolUpdate(): Promise<string> {
    await this.updateService.updateSymbolTables();
    return 'ok';
  }
}
