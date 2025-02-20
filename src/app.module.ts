import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DummyService } from './dummy/dummy.service';
import { LoggerService } from './logger/logger.service';
import { messageFromatter } from './helpers/message-formatter.helper';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [TasksModule],
  controllers: [AppController],
  providers: [AppService, DummyService, LoggerService, messageFromatter], // necessaire car les classe votn être resolus par nest js pour faire de la dépendance d'injection
})
export class AppModule {}
