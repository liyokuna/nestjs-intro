import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DummyService } from './dummy/dummy.service';
import { LoggerService } from './logger/logger.service';
import { messageFromatter } from './helpers/message-formatter.helper';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from 'config/app.config';
import { appConfigSchema, ConfigType } from 'config/config.types';
import { typeOrmConfig } from 'config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    /*TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigType>) => ({
        ...configService.get('database'),
      }),
    }),*/
    ConfigModule.forRoot({
      load: [appConfig, typeOrmConfig],
      validationSchema: appConfigSchema,
      validationOptions: {
        allowUnknown: true, // every single time nest sj run time and found an exception it throw an exception
        abortEarly: true, //
      },
    }),
    TypeOrmModule.forRoot(typeOrmConfig()),
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService, DummyService, LoggerService, messageFromatter], // necessaire car les classe votn être resolus par nest js pour faire de la dépendance d'injection
})
export class AppModule {}
