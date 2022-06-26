import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UpdateService {
  private readonly logger = new Logger(UpdateService.name);
}
