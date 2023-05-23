import { TestBed } from '@angular/core/testing';

import { LoggerService } from './logger.service';
import { LogType } from '../../enums/log-type';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return behavior subject as observable', () => {
    expect(service.getLogs()).toEqual(service['logs$'].asObservable());
  });

  Object.values(LogType)
    .filter(logType => !isNaN(+logType))
    .map(logType => +logType)
    .forEach(logType => {
      const logTypeName = LogType[logType].toLowerCase();
      it(`should add ${logTypeName} to behavior subject`, done => {
        const date = new Date('2023-05-22 12:00:00');
        jest.useFakeTimers().setSystemTime(date);
        const log = 'test message';
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        service[logTypeName](log);
        service.getLogs().subscribe(msg => {
          expect(msg[0]).toEqual({
            date: date,
            type: logType,
            content: log,
          });
          done();
        });
      });
    });

  it('should add new log at the top of the array', () => {
    const date = new Date('2023-05-22 12:00:00');
    jest.useFakeTimers().setSystemTime(date);
    const firstLog = 'first log';
    const secondLog = 'second log';
    (service as any).addLog(LogType.LOG, firstLog);
    (service as any).addLog(LogType.LOG, secondLog);
    expect(service['logs$'].getValue()).toEqual([
      {
        date: date,
        type: LogType.LOG,
        content: secondLog,
      },
      {
        date: date,
        type: LogType.LOG,
        content: firstLog,
      },
    ]);
  });
});
