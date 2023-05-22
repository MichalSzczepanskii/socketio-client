import { TestBed } from '@angular/core/testing';

import { WebsocketService } from './websocket.service';
import { SocketSetup } from '../../models/socket-setup';
import { io } from 'socket.io-client';

jest.mock('socket.io-client');

describe('WebsocketService', () => {
  let service: WebsocketService;
  const socketSetup: SocketSetup = {
    url: 'ws://localhost:3000',
    config: {
      query: {
        bearerToken: 'abc',
      },
    },
  };

  const mockSocket = {
    emit: jest.fn(),
    on: jest.fn(),
    disconnect: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set socket on init', () => {
    service.init(socketSetup);
    expect(io).toHaveBeenCalledWith(socketSetup.url, socketSetup.config);
  });

  it('should set socket on init without options', () => {
    service.init({ url: socketSetup.url });
    expect(io).toHaveBeenCalledWith(socketSetup.url, undefined);
  });

  it('should call disconnect when init is called second time', () => {
    (io as jest.Mock).mockReturnValue(mockSocket);
    service.init(socketSetup);
    expect(mockSocket.disconnect).not.toHaveBeenCalled();
    service.init(socketSetup);
    expect(mockSocket.disconnect).toHaveBeenCalled();
  });

  it('should subscribe to specific channel if socket is defined', done => {
    const channelName = 'events';

    (io as jest.Mock).mockReturnValue(mockSocket);
    service.init(socketSetup);
    service.joinChannel(channelName);
    expect(mockSocket.emit).toHaveBeenCalledWith('subscribe', channelName);
    service.getChannels().subscribe(channels => {
      expect(channels).toEqual([channelName]);
      done();
    });
  });

  it('should be able to subscribe to multiple channels', done => {
    const channelNameOne = 'events';
    const channelNameTwo = 'events2';
    (io as jest.Mock).mockReturnValue(mockSocket);
    service.init(socketSetup);
    service.joinChannel(channelNameOne);
    expect(mockSocket.emit).toHaveBeenCalledWith('subscribe', channelNameOne);
    service.joinChannel(channelNameTwo);
    expect(mockSocket.emit).toHaveBeenCalledWith('subscribe', channelNameTwo);
    service.getChannels().subscribe(channels => {
      expect(channels).toEqual([channelNameOne, channelNameTwo]);
      done();
    });
  });

  it('should return observable with subscribedChannels', () => {
    expect(service.getChannels()).toEqual(service['channels$'].asObservable());
  });

  it('should not subscribe to specific channel if socket is undefined', () => {
    const channelName = 'events';

    (io as jest.Mock).mockReturnValue(mockSocket);
    service.joinChannel(channelName);
    expect(mockSocket.emit).not.toHaveBeenCalled();
  });

  it('should add received message to Subject', done => {
    const message = 'test-message';
    mockSocket.on = jest
      .fn()
      .mockImplementation(
        (param: unknown, callback: (data: string) => void) => {
          callback(message);
        }
      );
    const channelName = 'events';
    jest.spyOn(service.message$, 'next');

    (io as jest.Mock).mockReturnValue(mockSocket);

    service.init(socketSetup);
    service.joinChannel(channelName);
    expect(mockSocket.on).toHaveBeenCalledWith(
      channelName,
      expect.any(Function)
    );
    expect(service.message$.next).toHaveBeenCalledWith(message);

    service.message$.asObservable().subscribe(data => {
      expect(data).toEqual(message);
      done();
    });
  });
});
