import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../../data-access/models/message';
import { MessageDataPipe } from '../message-data/message-data.pipe';

@Component({
  selector: 'socketio-client-messages',
  standalone: true,
  imports: [CommonModule, MessageDataPipe],
  template: `
    <div
      class="message"
      *ngFor="let message of messages"
      [class.bold]="message.hasOwnProperty('sent')">
      [{{ message.date | date : 'HH:mm:ss' }}][{{ message.channel }}]
      {{ message.data | messageData }}
    </div>
  `,
  styles: [
    `
      :host {
        flex: 1;
        overflow-y: auto;
      }
      .bold {
        font-weight: bold;
      }
    `,
  ],
})
export class MessagesComponent {
  @Input({ required: true })
  messages!: Message[];
}
