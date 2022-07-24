import { Test, TestingModule } from '@nestjs/testing';
import { FinMindService } from './fin-mind.service';

describe('FinMindService', () => {
  let service: FinMindService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinMindService],
    }).compile();

    service = module.get<FinMindService>(FinMindService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
