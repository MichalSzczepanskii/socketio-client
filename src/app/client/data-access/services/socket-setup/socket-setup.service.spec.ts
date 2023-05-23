import { TestBed } from '@angular/core/testing';

import { SocketSetupService } from './socket-setup.service';
import { LocalStorageMock } from '../../../../spec-helper/local-storage-mock';
import { MockProvider } from 'ng-mocks';
import { LoggerService } from '../logger/logger.service';

describe('SocketSetupService', () => {
  let service: SocketSetupService;
  let loggerService: LoggerService;

  const socketSetup = {
    url: 'ws://localhost:3000',
    config: {
      query: {
        bearerToken: 'abc',
      },
    },
  };

  Object.defineProperty(window, 'localStorage', {
    value: new LocalStorageMock(),
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(LoggerService)],
    });
    service = TestBed.inject(SocketSetupService);
    loggerService = TestBed.inject(LoggerService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should call retrieveSetupFromStorage on service constructor', () => {
    const spy = jest.spyOn(
      SocketSetupService.prototype as any,
      'retrieveSetupFromStorage'
    );
    new SocketSetupService(loggerService);
    expect(spy).toHaveBeenCalled();
  });

  it('should not call next on socketSetup subject if there is no data in localStorage', () => {
    jest.spyOn(localStorage, 'getItem');
    jest.spyOn(service['socketSetup$'], 'next');
    (service as any).retrieveSetupFromStorage();
    expect(localStorage.getItem).toHaveBeenCalledWith(
      service['localStorageKey']
    );
    expect(service['socketSetup$'].next).not.toHaveBeenCalled();
  });

  it('should call next on socketSetup subject if there is data in localStorage', () => {
    jest.spyOn(localStorage, 'getItem');
    jest.spyOn(service['socketSetup$'], 'next');
    localStorage.setItem(
      service['localStorageKey'],
      JSON.stringify(socketSetup)
    );
    (service as any).retrieveSetupFromStorage();
    expect(localStorage.getItem).toHaveBeenCalledWith(
      service['localStorageKey']
    );
    expect(service['socketSetup$'].next).toHaveBeenCalledWith(socketSetup);
  });

  it('should not call next on socketSetup subject if data in localStorage is not a json', () => {
    jest.spyOn(localStorage, 'getItem');
    jest.spyOn(service['socketSetup$'], 'next');
    localStorage.setItem(service['localStorageKey'], 'test');
    (service as any).retrieveSetupFromStorage();
    expect(localStorage.getItem).toHaveBeenCalledWith(
      service['localStorageKey']
    );
    expect(service['socketSetup$'].next).not.toHaveBeenCalledWith();
  });

  it('should return socketSetup as observable', () => {
    expect(service.getSocketSetup()).toEqual(
      service['socketSetup$'].asObservable()
    );
  });

  it('should save socketSetup to storage and behaviourSubject', () => {
    jest.spyOn(localStorage, 'setItem');
    jest.spyOn(service['socketSetup$'], 'next');
    service.saveSocketSetup(socketSetup);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      service['localStorageKey'],
      JSON.stringify(socketSetup)
    );
    expect(service['socketSetup$'].next).toHaveBeenCalledWith(socketSetup);
  });
});
