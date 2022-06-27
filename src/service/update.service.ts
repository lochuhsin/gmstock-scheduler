import { Injectable, Logger } from '@nestjs/common';
import { rmdb } from '../dao/rmdb';
import { util } from '../util/util';

@Injectable()
export class UpdateService {
  private readonly logger = new Logger(UpdateService.name);
  private readonly symbolQueue: util.queue<string>;
  private readonly pgDatabase;
  constructor() {
    this.symbolQueue = new util.queue();
    this.pgDatabase = new rmdb.postgres();
  }

  async initSymbolQueue(): Promise<void> {
    const table_arr = [
      'stocks',
      'forexpair',
      'cryptocurrency',
      'etf',
      'indices',
    ];

    for (const table_name of table_arr) {
      const result = await this.pgDatabase.getSymbol(table_name);
      for (const symbol of result) {
        this.symbolQueue.push_back(symbol);
      }
    }
    this.logger.log(`Update Symbol Queue at ${util.getCurrentTime()}`);
  }

  private updateSymbolQueue(): void {}

  private executeUpdate(): void {}
}
