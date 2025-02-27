import { Injectable } from '@nestjs/common';
import { DummyService } from './dummy/dummy.service';
import { LoggerService } from './logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from 'config/config.types';
import { AppConfig } from 'config/app.config';

@Injectable() // necessaire car il epermt de dire à nestjs de resoudre les dépendances
export class AppService {
  constructor(
    private readonly dummyService: DummyService,
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService<ConfigType>,
  ) {}
  getHello(): string {
    const prefix = this.configService.get<AppConfig>('app')?.messagePrefix;
    return `${prefix} Hello World! ${this.loggerService.log()}`;
  }
}
