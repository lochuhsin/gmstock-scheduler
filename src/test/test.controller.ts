import { Controller, Get } from '@nestjs/common';
import { TwelveDataService } from 'src/third-party/twelve-data/twelve-data.service';
import * as mongoose from 'mongoose';
import { RmdbService } from 'src/rmdb/rmdb.service';
import { util } from '../util/util';

@Controller('test')
export class TestController {
  constructor(
    private readonly twelveDataService: TwelveDataService,
    private readonly rmdbService: RmdbService,
  ) {}

  @Get('test1')
  async test1() {
    const endDate = new Date();
    const copyDate = new Date(endDate.valueOf());
    copyDate.setDate(copyDate.getDate() - 7000);
    console.log(copyDate);

    const end = util.convertDateToDateString(endDate);
    const start = util.convertDateToDateString(copyDate);

    const result: string[][] = await this.twelveDataService.testFunc(
      'AAPL',
      start,
      end,
    );
    return result.length;
  }

  @Get('dbtest')
  test() {
    mongoose.connection.on('open', function (ref) {
      mongoose.connection.db.listCollections().toArray(function (err, names) {
        console.log(names);
      });
    });
  }
}
