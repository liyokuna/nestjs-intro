import { Injectable } from '@nestjs/common';

@Injectable()
export class DummyService {
  public work(): string {
    return 'Test done !';
  }
}
