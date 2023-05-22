import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsComponent } from './logs.component';
import { LogType } from '../../data-access/enums/log-type';
import { Log } from '../../data-access/models/log';
import { By } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

describe('LogsComponent', () => {
  let component: LogsComponent;
  let fixture: ComponentFixture<LogsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LogsComponent],
      providers: [DatePipe],
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
        const date = new Date('2023-05-22 12:00');
        const log: Log = {
          date: date,
          type: logType,
          content: 'test',
        };
        component.logs = [log];
        jest.useFakeTimers().setSystemTime(date);
        fixture.detectChanges();
        const logElement = fixture.debugElement.query(By.css('.log'));
        expect(logElement.nativeElement.textContent).toEqual(
          ` [12:00:00] ${log.content} `
        );
        expect(logElement.classes[`text-${logTypeName}`]).toBeTruthy();
      });
    });
});
