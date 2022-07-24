import { Test, TestingModule } from '@nestjs/testing';
import { UpdateInfoService } from './update-info.service';

describe('UpdateInfoService', () => {
  let service: UpdateInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateInfoService],
    }).compile();

    service = module.get<UpdateInfoService>(UpdateInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
