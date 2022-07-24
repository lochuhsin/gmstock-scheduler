import { Test, TestingModule } from '@nestjs/testing';
import { TwelveDataService } from './twelve-data.service';

describe('TwelveDataService', () => {
  let service: TwelveDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwelveDataService],
    }).compile();

    service = module.get<TwelveDataService>(TwelveDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
