import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Log } from '../../models/log';
import { LogType } from '../../enums/log-type';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private logs$: BehaviorSubject<Log[]> = new BehaviorSubject<Log[]>([]);

  getLogs() {
    return this.logs$.asObservable();
  }

  log(message: string) {
    this.addLog(LogType.LOG, message);
  }

  info(message: string) {
    this.addLog(LogType.INFO, message);
  }

  error(message: string) {
    this.addLog(LogType.ERROR, message);
  }

  warn(message: string) {
    this.addLog(LogType.WARN, message);
  }

  success(message: string) {
    this.addLog(LogType.SUCCESS, message);
  }

  private addLog(type: LogType, message: string) {
    this.logs$.next(
      [
        {
          date: new Date(),
          type: type,
          content: message,
        },
      ].concat(this.logs$.getValue())
    );
  }
}
