import { TestBed } from '@angular/core/testing';

import { WebsocketService } from './websocket.service';
import { SocketSetup } from '../../models/socket-setup';
import { io } from 'socket.io-client';
import { MockProvider } from 'ng-mocks';
import { LoggerService } from '../logger/logger.service';
import { Message } from '../../models/message';
import { SentMessage } from '../../models/sent-message';

jest.mock('socket.io-client');

describe('WebsocketService', () => {
  let service: WebsocketService;
  let loggerService: LoggerService;
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
    TestBed.configureTestingModule({
      providers: [MockProvider(LoggerService)],
    });
    service = TestBed.inject(WebsocketService);
    loggerService = TestBed.inject(LoggerService);
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
    jest.spyOn(service['connected$'], 'next');
    service.init(socketSetup);
    expect(io).toHaveBeenCalledWith(socketSetup.url, socketSetup.config);
    expect(service['connected$'].next).toHaveBeenCalledWith(true);
  });

  it('should set socket on init without options', () => {
    jest.spyOn(service['connected$'], 'next');
    service.init({ url: socketSetup.url });
    expect(io).toHaveBeenCalledWith(socketSetup.url, undefined);
    expect(service['connected$'].next).toHaveBeenCalledWith(true);
  });

  it('should call disconnect when init is called second time', () => {
    (io as jest.Mock).mockReturnValue(mockSocket);
    service.init(socketSetup);
    expect(mockSocket.disconnect).not.toHaveBeenCalled();
    service.init(socketSetup);
    expect(mockSocket.disconnect).toHaveBeenCalled();
  });

  it('should call disconnect if socket is definied', () => {
    jest.spyOn(service['connected$'], 'next');
    jest.spyOn(service['channels$'], 'next');
    jest.spyOn(service['messages$'], 'next');
    service.init(socketSetup);
    service.disconnect();
    expect(mockSocket.disconnect).toHaveBeenCalled();
    expect(service['connected$'].next).toHaveBeenCalledWith(false);
    expect(service['channels$'].next).toHaveBeenCalledWith([]);
    expect(service['messages$'].next).toHaveBeenCalledWith([]);
  });

  it('should not call disconnect if socket is undefinied', () => {
    jest.spyOn(service['connected$'], 'next');
    service.disconnect();
    expect(mockSocket.disconnect).not.toHaveBeenCalled();
    expect(service['connected$'].next).not.toHaveBeenCalled();
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

  it('should return observable with messages', () => {
    expect(service.getMessages()).toEqual(service['messages$'].asObservable());
  });

  it('should return observable with connected', () => {
    expect(service.isConnected()).toEqual(service['connected$'].asObservable());
  });

  it('should not subscribe to specific channel if socket is undefined', () => {
    const channelName = 'events';

    (io as jest.Mock).mockReturnValue(mockSocket);
    service.joinChannel(channelName);
    expect(mockSocket.emit).not.toHaveBeenCalled();
  });

  it('should add received message to BehaviorSubject', () => {
    jest.spyOn(service as any, 'saveMessage');
    const date = new Date('2023-05-23 12:00');
    jest.useFakeTimers().setSystemTime(date);
    const message = 'test-message';
    mockSocket.on = jest
      .fn()
      .mockImplementation(
        (param: unknown, callback: (data: string) => void) => {
          callback(message);
        }
      );
    const channelName = 'events';

    (io as jest.Mock).mockReturnValue(mockSocket);

    service.init(socketSetup);
    service.joinChannel(channelName);
    expect(mockSocket.on).toHaveBeenCalledWith(
      channelName,
      expect.any(Function)
    );

    expect((service as any).saveMessage).toHaveBeenCalledWith({
      date: date,
      channel: channelName,
      data: message,
    });
  });

  it('should add message at the top of the array in BehaviourSubject', () => {
    const firstMessage: Message = {
      date: new Date(),
      channel: 'test',
      data: 'first message',
    };
    const secondMessage: Message = {
      date: new Date(),
      channel: 'test',
      data: 'second message',
    };
    (service as any).saveMessage(firstMessage);
    (service as any).saveMessage(secondMessage);
    expect(service['messages$'].getValue()).toEqual([
      secondMessage,
      firstMessage,
    ]);
  });

  describe('logging', () => {
    it('should log socket io connect event', () => {
      mockSocket.on = jest
        .fn()
        .mockImplementation(
          (params = 'connect', callback: (data: string) => void) => {
            callback('message');
          }
        );
      jest.spyOn(loggerService, 'success');

      (io as jest.Mock).mockReturnValue(mockSocket);
      service.init(socketSetup);
      expect(loggerService.success).toHaveBeenCalledWith(
        'Successfully connected'
      );
    });

    it('should log error socket io connect_error event', () => {
      mockSocket.on = jest
        .fn()
        .mockImplementation(
          (params = 'connect_error', callback: (data: object) => void) => {
            callback({ message: 'reason' });
          }
        );
      jest.spyOn(loggerService, 'error');

      (io as jest.Mock).mockReturnValue(mockSocket);
      service.init(socketSetup);
      expect(loggerService.error).toHaveBeenCalledWith(
        'Connection error due to reason'
      );
    });

    it('should log info socket io reconnect event', () => {
      mockSocket.on = jest
        .fn()
        .mockImplementation(
          (params = 'reconnect', callback: (data: number) => void) => {
            callback(5);
          }
        );
      jest.spyOn(loggerService, 'info');

      (io as jest.Mock).mockReturnValue(mockSocket);
      service.init(socketSetup);
      expect(loggerService.info).toHaveBeenCalledWith(
        'Reconnected after 5 attempts'
      );
    });

    it('should log warn socket io reconnecting event', () => {
      mockSocket.on = jest
        .fn()
        .mockImplementation(
          (params = 'reconnecting', callback: (data: number) => void) => {
            callback(5);
          }
        );
      jest.spyOn(loggerService, 'warn');

      (io as jest.Mock).mockReturnValue(mockSocket);
      service.init(socketSetup);
      expect(loggerService.warn).toHaveBeenCalledWith(
        'Trying to reconnect. Attempt: 5'
      );
    });

    it('should log error socket io reconnect_error event', () => {
      mockSocket.on = jest
        .fn()
        .mockImplementation(
          (params = 'reconnect_error', callback: (data: object) => void) => {
            callback({ message: 'reason' });
          }
        );
      jest.spyOn(loggerService, 'error');

      (io as jest.Mock).mockReturnValue(mockSocket);
      service.init(socketSetup);
      expect(loggerService.error).toHaveBeenCalledWith(
        'Reconnection error due to reason'
      );
    });

    it('should log error socket io reconnect_error event', () => {
      mockSocket.on = jest
        .fn()
        .mockImplementation(
          (params = 'disconnect', callback: (data: string) => void) => {
            callback('reason');
          }
        );
      jest.spyOn(loggerService, 'info');

      (io as jest.Mock).mockReturnValue(mockSocket);
      service.init(socketSetup);
      expect(loggerService.info).toHaveBeenCalledWith(
        'Disconnected due to reason'
      );
    });
  });

  it('should not emit unsubscribe message on leaveChannel if socket is undefined', () => {
    const channelName = 'events';
    (io as jest.Mock).mockReturnValue(mockSocket);
    service.leaveChannel(channelName);
    expect(mockSocket.emit).not.toHaveBeenCalled();
  });

  it('should remove channel from list and emit unsubscribe message on leaveChannel', () => {
    const channelName = 'events';
    (io as jest.Mock).mockReturnValue(mockSocket);
    service.init(socketSetup);
    service.joinChannel(channelName);
    service.leaveChannel(channelName);
    expect(mockSocket.emit).toHaveBeenCalledWith('unsubscribe', channelName);
    expect(service['channels$'].getValue()).not.toContain(channelName);
  });

  it('should not emit message on leaveChannel if channel is not subscribed', () => {
    const channelName = 'events';
    (io as jest.Mock).mockReturnValue(mockSocket);
    service.init(socketSetup);
    service.leaveChannel(channelName);
    expect(mockSocket.emit).not.toHaveBeenCalled();
  });

  it('should send message if socket is defined', () => {
    jest.spyOn(service as any, 'saveMessage');
    const message: SentMessage = {
      date: new Date(),
      channel: 'test',
      data: 'test',
      sent: true,
    };
    (io as jest.Mock).mockReturnValue(mockSocket);
    service.init(socketSetup);
    service.sendMessage(message);
    expect(mockSocket.emit).toHaveBeenCalledWith(message.channel, message.data);
    expect(service['saveMessage']).toHaveBeenCalledWith(message);
  });

  it('should not send message if socket is undefined', () => {
    jest.spyOn(service as any, 'saveMessage');
    const message: SentMessage = {
      date: new Date(),
      channel: 'test',
      data: 'test',
      sent: true,
    };
    (io as jest.Mock).mockReturnValue(mockSocket);
    service.sendMessage(message);
    expect(mockSocket.emit).not.toHaveBeenCalled();
    expect(service['saveMessage']).not.toHaveBeenCalled();
  });
});
