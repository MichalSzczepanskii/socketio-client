import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { SocketSetup } from '../../models/socket-setup';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  socket?: Socket;
  message$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private channels$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(
    []
  );
  init(socketSetup: SocketSetup) {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = undefined;
    }
    this.socket = io(socketSetup.url, socketSetup.config);
  }

  joinChannel(channelName: string) {
    if (!this.socket) return;
    this.socket.emit('subscribe', channelName);
    this.channels$.next(this.channels$.getValue().concat([channelName]));
    this.socket.on(channelName, data => {
      this.message$.next(data);
    });
  }

  getChannels() {
    return this.channels$.asObservable();
  }
}
