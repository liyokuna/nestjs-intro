import { Injectable } from '@nestjs/common';
import { messageFromatter } from 'src/helpers/message-formatter.helper';

@Injectable()
export class LoggerService {
  constructor(private messagefromatter: messageFromatter) {}
  log(): string {
    return this.messagefromatter.format('Hello world!');
  }
}
