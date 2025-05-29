import { Injectable } from '@nestjs/common';
import { messageFromatter } from './../helpers/message-formatter.helper';

@Injectable()
export class LoggerService {
  constructor(private messagefromatter: messageFromatter) {}
  log(): string {
    return this.messagefromatter.format('Hello world!');
  }
}
