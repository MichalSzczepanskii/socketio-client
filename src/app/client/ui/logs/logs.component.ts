import { Component, Input } from '@angular/core';
import { Log } from '../../data-access/models/log';
import { LogType } from '../../data-access/enums/log-type';
import * as dayjs from 'dayjs';
import { NgClass, NgForOf } from '@angular/common';

@Component({
  selector: 'socketio-client-logs',
  standalone: true,
  template: `
    <div
      *ngFor="let log of logs"
      [ngClass]="['text-' + LogType[log.type].toLowerCase(), 'log']">
      [{{ dayjs().format('HH:mm') }}] {{ log.content }}
    </div>
  `,
  styles: [],
  imports: [NgClass, NgForOf],
})
export class LogsComponent {
  @Input({ required: true }) logs!: Log[];
  protected readonly LogType = LogType;
  protected readonly dayjs = dayjs;
}
