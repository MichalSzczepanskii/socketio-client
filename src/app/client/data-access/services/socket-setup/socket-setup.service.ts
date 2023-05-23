import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SocketSetup } from '../../models/socket-setup';
import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class SocketSetupService {
  private readonly localStorageKey = 'SOCKET_SETUP';
  private socketSetup$: BehaviorSubject<SocketSetup | null> =
    new BehaviorSubject<SocketSetup | null>(null);

  constructor(private loggerService: LoggerService) {
    this.retrieveSetupFromStorage();
  }

  private retrieveSetupFromStorage() {
    const socketSetup = localStorage.getItem(this.localStorageKey);
    try {
      if (socketSetup) this.socketSetup$.next(JSON.parse(socketSetup));
    } catch (e) {
      this.loggerService.error(
        `Could not retrieve SocketSetup from localStorage: ${e}`
      );
    }
  }

  getSocketSetup() {
    return this.socketSetup$.asObservable();
  }

  saveSocketSetup(socketSetup: SocketSetup) {
    localStorage.setItem(this.localStorageKey, JSON.stringify(socketSetup));
    this.socketSetup$.next(socketSetup);
  }
}
