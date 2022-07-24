import { Test, TestingModule } from '@nestjs/testing';
import { InitDataService } from './init-data.service';

describe('InitDataService', () => {
  let service: InitDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InitDataService],
    }).compile();

    service = module.get<InitDataService>(InitDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
