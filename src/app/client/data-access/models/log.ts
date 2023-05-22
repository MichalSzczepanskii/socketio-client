import { LogType } from '../enums/log-type';

export interface Log {
  date: Date;
  type: LogType;
  content: string;
}
