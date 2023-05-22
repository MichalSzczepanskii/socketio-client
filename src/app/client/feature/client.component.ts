import { Component, OnInit } from '@angular/core';
import { Socket } from 'socket.io-client';
import { SocketSetup } from '../data-access/models/socket-setup';
import { LoggerService } from '../data-access/services/logger/logger.service';
import { Observable } from 'rxjs';
import { Log } from '../data-access/models/log';

@Component({
  selector: 'socketio-client-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
})
export class ClientComponent implements OnInit {
  socket?: Socket;
  socketSetup?: SocketSetup;
  logs$!: Observable<Log[]>;

  constructor(private loggerService: LoggerService) {}
  ngOnInit() {
    this.logs$ = this.loggerService.getLogs();
  }

  setSocketSetup(socketSetup: SocketSetup) {
    this.socketSetup = socketSetup;
  }
}
