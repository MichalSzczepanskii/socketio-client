import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsComponent } from './logs.component';
import { LogType } from '../../data-access/enums/log-type';
import { Log } from '../../data-access/models/log';
import { By } from '@angular/platform-browser';
import * as dayjs from 'dayjs';

describe('LogsComponent', () => {
  let component: LogsComponent;
  let fixture: ComponentFixture<LogsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LogsComponent],
    });
    fixture = TestBed.createComponent(LogsComponent);
    component = fixture.componentInstance;
  });

  Object.values(LogType)
    .filter(logType => !isNaN(+logType))
    .map(logType => +logType)
    .forEach(logType => {
      const logTypeName = LogType[logType].toLowerCase();
      it(`should display ${logTypeName} log with appropriate class name`, () => {
        const log: Log = {
          type: logType,
          content: 'test',
        };
        component.logs = [log];
        jest.useFakeTimers().setSystemTime(dayjs('2023-05-22 12:00').toDate());
        fixture.detectChanges();
        const logElement = fixture.debugElement.query(By.css('.log'));
        expect(logElement.nativeElement.textContent).toEqual(
          ` [12:00] ${log.content} `
        );
        expect(logElement.classes[`text-${logTypeName}`]).toBeTruthy();
      });
    });
});
