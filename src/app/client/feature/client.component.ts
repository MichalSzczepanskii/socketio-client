import { Component } from '@angular/core';
import { Socket } from 'socket.io-client';
import { SocketSetup } from '../data-access/models/socket-setup';

@Component({
  selector: 'socketio-client-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
})
export class ClientComponent {
  socket?: Socket;
  socketSetup?: SocketSetup;

  setSocketSetup(socketSetup: SocketSetup) {
    this.socketSetup = socketSetup;
  }
}
