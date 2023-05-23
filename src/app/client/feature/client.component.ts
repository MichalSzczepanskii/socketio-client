import { Component, OnInit } from '@angular/core';
import { SocketSetup } from '../data-access/models/socket-setup';
import { LoggerService } from '../data-access/services/logger/logger.service';
import { Observable } from 'rxjs';
import { Log } from '../data-access/models/log';
import { WebsocketService } from '../data-access/services/websocket/websocket.service';

@Component({
  selector: 'socketio-client-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
})
export class ClientComponent implements OnInit {
  showForm = true;
  socketSetup?: SocketSetup;
  logs$!: Observable<Log[]>;

  constructor(
    private loggerService: LoggerService,
    private websocketService: WebsocketService
  ) {}
  ngOnInit() {
    this.logs$ = this.loggerService.getLogs();
  }

  connectToSocket(socketSetup: SocketSetup) {
    this.socketSetup = socketSetup;
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
}
