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

  it('should add log to behavior subject', done => {
    const log = 'test message';
    service.log(log);
    service.getLogs().subscribe(msg => {
      expect(msg).toEqual({
        type: LogType.LOG,
        content: log,
      });
      done();
    });
  });

  Object.values(LogType)
    .filter(logType => !isNaN(+logType))
    .map(logType => +logType)
    .forEach(logType => {
      const logTypeName = LogType[logType].toLowerCase();
      it(`should add ${logTypeName} to behavior subject`, done => {
        const log = 'test message';
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        service[logTypeName](log);
        service.getLogs().subscribe(msg => {
          expect(msg).toEqual({
            type: logType,
            content: log,
          });
          done();
        });
      });
    });
});
