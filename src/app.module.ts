import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DummyService } from './dummy/dummy.service';
import { LoggerService } from './logger/logger.service';
import { messageFromatter } from './helpers/message-formatter.helper';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from '../config/app.config';
import { appConfigSchema } from '../config/config.types';
import { typeOrmConfig } from '../config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { authConfig } from '../config/auth.config';
import { UsersModule } from './users/users.module';
import { TypedConfigService } from '../config/typed-config.service';

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
      isGlobal: true,
      load: [appConfig, authConfig, typeOrmConfig],
      validationSchema: appConfigSchema,
      validationOptions: {
        allowUnknown: true, // every single time nest sj run time and found an exception it throw an exception
        abortEarly: true, //
      },
    }),
    TypeOrmModule.forRoot(typeOrmConfig()),
    TasksModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    DummyService,
    LoggerService,
    messageFromatter,
    TypedConfigService,
  ], // necessaire car les classe votn être resolus par nest js pour faire de la dépendance d'injection
})
export class AppModule {}
