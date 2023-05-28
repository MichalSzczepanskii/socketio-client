import { Message } from './message';

export interface SentMessage extends Message {
  sent: boolean;
}
