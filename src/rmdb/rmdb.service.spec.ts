import { Test, TestingModule } from '@nestjs/testing';
import { RmdbService } from './rmdb.service';

describe('RmdbService', () => {
  let service: RmdbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RmdbService],
    }).compile();

    service = module.get<RmdbService>(RmdbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
