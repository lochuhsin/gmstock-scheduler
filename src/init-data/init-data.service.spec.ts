import { Test, TestingModule } from '@nestjs/testing';
import { initDataService } from './init-data.service';

describe('InitDataService', () => {
  let service: initDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [initDataService],
    }).compile();

    service = module.get<initDataService>(initDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
