import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { SocketSetup } from '../../models/socket-setup';
import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  socket?: Socket;
  message$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private channels$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(
    []
  );

  constructor(private loggerService: LoggerService) {}

  init(socketSetup: SocketSetup) {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = undefined;
    }
    this.socket = io(socketSetup.url, socketSetup.config);
    this.listenToClientEvents();
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

  private listenToClientEvents() {
    if (!this.socket) return;
    this.socket.on('connect', () => {
      this.loggerService.success('Successfully connected');
    });
    this.socket.on('connect_error', err => {
      this.loggerService.error(`Connection error due to ${err.message}`);
    });

    this.socket.on('reconnect', attempt => {
      this.loggerService.info(`Reconnected after ${attempt} attempts`);
    });

    this.socket.on('reconnecting', attempt => {
      this.loggerService.warn(`Trying to reconnect. Attempt: ${attempt}`);
    });

    this.socket.on('reconnect_error', err => {
      this.loggerService.error(`Reconnection error due to ${err.message}`);
    });
  }

  disconnect() {
    if (!this.socket) return;
    this.socket.disconnect();
  }
}
