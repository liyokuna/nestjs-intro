import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DummyService } from './dummy/dummy.service';
import { LoggerService } from './logger/logger.service';
import { messageFromatter } from './helpers/message-formatter.helper';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from 'config/app.config';
import { appConfigSchema } from 'config/config.types';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      validationSchema: appConfigSchema,
      validationOptions: {
        allowUnknown: true, // every single time nest sj run time and found an exception it throw an exception
        abortEarly: true, //
      },
    }),
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService, DummyService, LoggerService, messageFromatter], // necessaire car les classe votn être resolus par nest js pour faire de la dépendance d'injection
})
export class AppModule {}
