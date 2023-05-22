import { LogType } from '../enums/log-type';

export interface Log {
  type: LogType;
  content: string;
}
