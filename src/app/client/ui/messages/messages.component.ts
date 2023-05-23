import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../../data-access/models/message';
import { MessageDataPipe } from '../message-data/message-data.pipe';

@Component({
  selector: 'socketio-client-messages',
  standalone: true,
  imports: [CommonModule, MessageDataPipe],
  template: `
    <div class="message" *ngFor="let message of messages">
      [{{ message.date | date : 'HH:mm:ss' }}][{{ message.channel }}]
      {{ message.data | messageData }}
    </div>
  `,
  styles: [],
})
export class MessagesComponent {
  @Input({ required: true })
  messages!: Message[];
}
