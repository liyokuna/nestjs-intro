import { Injectable } from '@nestjs/common';
import { DummyService } from './dummy/dummy.service';
import { LoggerService } from './logger/logger.service';

@Injectable() // necessaire car il epermt de dire à nestjs de resoudre les dépendances
export class AppService {
  constructor(
    private readonly dummyService: DummyService,
    private readonly loggerService: LoggerService,
  ) {}
  getHello(): string {
    return `Hello World! ${this.loggerService.log()}`;
  }
}
