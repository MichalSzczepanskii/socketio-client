import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesComponent } from './messages.component';
import { Message } from '../../data-access/models/message';
import { By } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { MessageDataPipe } from '../message-data/message-data.pipe';
import { SentMessage } from '../../data-access/models/sent-message';

describe('MessagesComponent', () => {
  let component: MessagesComponent;
  let fixture: ComponentFixture<MessagesComponent>;
  let messageDataPipe: MessageDataPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MessagesComponent],
      providers: [DatePipe, MessageDataPipe],
    });
    fixture = TestBed.createComponent(MessagesComponent);
    component = fixture.componentInstance;
    messageDataPipe = TestBed.inject(MessageDataPipe);
  });

  it('should display messages', () => {
    const messages: Message[] = [
      {
        date: new Date('2023-05-23 12:00:00'),
        channel: 'events',
        data: 'message',
      },
      {
        date: new Date('2023-05-23 12:00:00'),
        channel: 'test',
        data: 'test',
      },
      {
        date: new Date('2023-05-23 12:00:00'),
        channel: 'test',
        data: { content: 'test' },
      },
    ];
    component.messages = messages;
    fixture.detectChanges();
    const logs = fixture.debugElement
      .queryAll(By.css('.message'))
      .map(log => log.nativeElement.textContent);
    expect(logs).toEqual(
      messages.map(
        message =>
          ` [12:00:00][${message.channel}] ${messageDataPipe.transform(
            message.data
          )} `
      )
    );
  });

  it('should display message with bold class if it is instance of SentMessage', () => {
    const sentMessage: SentMessage = {
      date: new Date(),
      channel: 'test',
      data: { msg: 'test' },
      sent: true,
    };
    component.messages = [sentMessage];
    fixture.detectChanges();
    const logs = fixture.debugElement.query(By.css('.message'));
    expect(logs.classes['bold']).toBeTruthy();
  });
});
