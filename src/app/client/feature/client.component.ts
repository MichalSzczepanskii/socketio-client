import { Component, OnInit } from '@angular/core';
import { SocketSetup } from '../data-access/models/socket-setup';
import { LoggerService } from '../data-access/services/logger/logger.service';
import { iif, map, Observable } from 'rxjs';
import { Log } from '../data-access/models/log';
import { WebsocketService } from '../data-access/services/websocket/websocket.service';
import { Message } from '../data-access/models/message';
import { SocketSetupService } from '../data-access/services/socket-setup/socket-setup.service';
import { SentMessage } from '../data-access/models/sent-message';

@Component({
  selector: 'socketio-client-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
})
export class ClientComponent implements OnInit {
  showForm = true;
  socketSetup$!: Observable<SocketSetup | null>;
  logs$!: Observable<Log[]>;
  channels$!: Observable<string[]>;
  messages$!: Observable<Message[]>;

  constructor(
    private loggerService: LoggerService,
    private websocketService: WebsocketService,
    private socketSetupService: SocketSetupService
  ) {}
  ngOnInit() {
    this.logs$ = this.loggerService.getLogs();
    this.channels$ = this.websocketService.getChannels();
    this.messages$ = this.websocketService.getMessages();
    this.socketSetup$ = this.socketSetupService.getSocketSetup();
  }

  connectToSocket(socketSetup: SocketSetup) {
    this.socketSetupService.saveSocketSetup(socketSetup);
    this.websocketService.init(socketSetup);
    this.showForm = false;
  }

  disconnect() {
    this.websocketService.disconnect();
    this.showForm = true;
  }

  joinToChannel(channelName: string) {
    this.websocketService.joinChannel(channelName);
  }

  leaveChannel(channelName: string) {
    this.websocketService.leaveChannel(channelName);
  }

  filterChannelMessage(channel: string) {
    this.messages$ = iif(
      () => channel === 'All',
      this.websocketService.getMessages(),
      this.websocketService
        .getMessages()
        .pipe(
          map(messages =>
            messages.filter(message => message.channel === channel)
          )
        )
    );
  }

  sendMessage(msg: SentMessage) {
    this.websocketService.sendMessage(msg);
  }
}
