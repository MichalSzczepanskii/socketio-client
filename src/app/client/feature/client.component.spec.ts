import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { ClientComponent } from './client.component';
import { MockComponents, MockProviders } from 'ng-mocks';
import { SetupFormComponent } from '../ui/setup-form/setup-form.component';
import { By } from '@angular/platform-browser';
import { SocketSetup } from '../data-access/models/socket-setup';
import { LoggerService } from '../data-access/services/logger/logger.service';
import { of } from 'rxjs';
import { LogType } from '../data-access/enums/log-type';
import { LogsComponent } from '../ui/logs/logs.component';
import { SetupInfoComponent } from '../ui/setup-info/setup-info.component';
import { WebsocketService } from '../data-access/services/websocket/websocket.service';
import { SubscriptionFormComponent } from '../ui/subscription-form/subscription-form.component';
import { ChannelFilterComponent } from '../ui/channel-filter/channel-filter.component';
import { Message } from '../data-access/models/message';
import { MessagesComponent } from '../ui/messages/messages.component';
import { UnsubscriptionFormComponent } from '../ui/unsubscription-form/unsubscription-form.component';
import { SocketSetupService } from '../data-access/services/socket-setup/socket-setup.service';
import { MessageFormComponent } from '../ui/message-form/message-form.component';
import { SentMessage } from '../data-access/models/sent-message';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatAccordionHarness } from '@angular/material/expansion/testing';

describe('ClientComponent', () => {
  let component: ClientComponent;
  let fixture: ComponentFixture<ClientComponent>;
  let loggerService: LoggerService;
  let websocketService: WebsocketService;
  let socketSetupService: SocketSetupService;
  let loader: HarnessLoader;

  const eventsMessage: Message = {
    date: new Date(),
    channel: 'events',
    data: 'test',
  };
  const testMessage = {
    date: new Date(),
    channel: 'test',
    data: 'test',
  };
  const mockMessages: Message[] = [eventsMessage, testMessage];
  const mockSocketSetup = {
    url: 'test',
    config: { query: { bearerToken: 'abc' } },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientComponent],
      imports: [
        MockComponents(
          SetupFormComponent,
          LogsComponent,
          SetupInfoComponent,
          SubscriptionFormComponent,
          ChannelFilterComponent,
          MessagesComponent,
          UnsubscriptionFormComponent,
          MessageFormComponent
        ),
        MatExpansionModule,
        BrowserAnimationsModule.withConfig({ disableAnimations: true }),
      ],
      providers: [
        MockProviders(LoggerService, WebsocketService, SocketSetupService),
      ],
    });
    fixture = TestBed.createComponent(ClientComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    loggerService = TestBed.inject(LoggerService);
    websocketService = TestBed.inject(WebsocketService);
    socketSetupService = TestBed.inject(SocketSetupService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display setup-form component if showForm is true', () => {
    component.showForm = true;
    fixture.detectChanges();
    const setupForm = fixture.debugElement.query(
      By.directive(SetupFormComponent)
    );
    expect(setupForm).toBeTruthy();
  });

  it('should not display setup-form component if showForm is false', () => {
    component.showForm = false;
    fixture.detectChanges();
    const setupForm = fixture.debugElement.query(
      By.directive(SetupFormComponent)
    );
    expect(setupForm).toBeFalsy();
  });

  describe('connect button click', () => {
    const socketSetup: SocketSetup = { url: 'test' };
    beforeEach(fakeAsync(() => {
      component.showForm = true;
      jest.spyOn(websocketService, 'init');
      jest.spyOn(socketSetupService, 'saveSocketSetup');
      fixture.detectChanges();
      const setupForm = fixture.debugElement.query(
        By.directive(SetupFormComponent)
      );
      setupForm.triggerEventHandler('submittedData', socketSetup);
      tick();
    }));

    it('should save socketSetup to variable on emit from setup-form', () => {
      expect(socketSetupService.saveSocketSetup).toHaveBeenCalledWith(
        socketSetup
      );
    });

    it('should call websocketService.init on click with connect button', () => {
      expect(websocketService.init).toHaveBeenCalledWith(socketSetup);
    });

    it('should change showForm to false', () => {
      expect(component.showForm).toEqual(false);
    });
  });

  describe('disconnect button click', () => {
    const socketSetup = {
      url: 'test',
      config: { query: { bearerToken: 'abc' } },
    };
    beforeEach(fakeAsync(() => {
      jest
        .spyOn(socketSetupService, 'getSocketSetup')
        .mockReturnValue(of(socketSetup));
      component.showForm = false;
      fixture.detectChanges();
      jest.spyOn(websocketService, 'disconnect');
      const setupInfo = fixture.debugElement.query(
        By.directive(SetupInfoComponent)
      );
      setupInfo.triggerEventHandler('disconnectClicked', true);
      tick();
    }));

    it('should call disconnect on websocket service', () => {
      expect(websocketService.disconnect).toHaveBeenCalled();
    });

    it('should set showForm to true', () => {
      expect(component.showForm).toEqual(true);
    });

    it('should fill form with socketSetup', () => {
      fixture.detectChanges();
      const setupForm = fixture.debugElement.query(
        By.directive(SetupFormComponent)
      ).componentInstance;
      expect(setupForm.socketSetup).toEqual(socketSetup);
    });
  });

  it('should display logs', () => {
    jest.spyOn(loggerService, 'getLogs').mockReturnValue(
      of([
        {
          date: new Date('2023-05-22 12:00:00'),
          type: LogType.INFO,
          content: 'test message',
        },
      ])
    );
    fixture.detectChanges();
    const logsComponent = fixture.debugElement.query(
      By.directive(LogsComponent)
    );
    expect(logsComponent).toBeTruthy();
  });

  it('should display setup-info component if socketSetup is defined', () => {
    jest
      .spyOn(socketSetupService, 'getSocketSetup')
      .mockReturnValue(of(mockSocketSetup));
    component.showForm = false;
    fixture.detectChanges();
    const setupInfoComponent = fixture.debugElement.query(
      By.directive(SetupInfoComponent)
    );
    expect(setupInfoComponent).toBeTruthy();
    expect(setupInfoComponent.componentInstance.socketSetup).toEqual(
      mockSocketSetup
    );
  });

  it('should display subscription-form if socketSetup is defined', () => {
    jest
      .spyOn(socketSetupService, 'getSocketSetup')
      .mockReturnValue(of(mockSocketSetup));
    component.showForm = false;
    fixture.detectChanges();
    const subscriptionForm = fixture.debugElement.query(
      By.directive(SubscriptionFormComponent)
    );
    expect(subscriptionForm).toBeTruthy();
  });

  it('should call websocketService.subscribe with channel emitted from subscription-form', () => {
    jest.spyOn(websocketService, 'joinChannel');
    jest
      .spyOn(socketSetupService, 'getSocketSetup')
      .mockReturnValue(of(mockSocketSetup));
    component.showForm = false;
    fixture.detectChanges();
    const subscriptionForm = fixture.debugElement.query(
      By.directive(SubscriptionFormComponent)
    );
    const channelName = 'events';
    subscriptionForm.triggerEventHandler('channelSubscribed', channelName);
    expect(websocketService.joinChannel).toHaveBeenCalledWith(channelName);
  });

  it('should display channel-filter if there is at least one channel subscribed', () => {
    jest
      .spyOn(websocketService, 'getChannels')
      .mockReturnValue(of(['events', 'test']));
    fixture.detectChanges();
    const channelFilter = fixture.debugElement.query(
      By.directive(ChannelFilterComponent)
    );
    expect(channelFilter).toBeTruthy();
  });

  it('should not display channel-filter if there is no channel subscribed', () => {
    jest.spyOn(websocketService, 'getChannels').mockReturnValue(of([]));
    fixture.detectChanges();
    const channelFilter = fixture.debugElement.query(
      By.directive(ChannelFilterComponent)
    );
    expect(channelFilter).toBeFalsy();
  });

  describe('message filtering', () => {
    beforeEach(() => {
      jest
        .spyOn(websocketService, 'getChannels')
        .mockReturnValue(of(['events', 'test']));
      jest
        .spyOn(websocketService, 'getMessages')
        .mockReturnValue(of(mockMessages));
    });

    it('should set messages to all messages', done => {
      fixture.detectChanges();
      component.messages$.subscribe(messages => {
        expect(messages).toEqual(mockMessages);
        done();
      });
    });

    it('should filter messages based on emit from channel-filter', done => {
      fixture.detectChanges();
      const channelFilter = fixture.debugElement.query(
        By.directive(ChannelFilterComponent)
      );
      channelFilter.triggerEventHandler('selectedChannel', 'events');
      component.messages$.subscribe(messages => {
        expect(messages).toEqual([eventsMessage]);
        done();
      });
    });

    it('should return all messages after switching back to all', done => {
      fixture.detectChanges();
      component.filterChannelMessage('events');
      const channelFilter = fixture.debugElement.query(
        By.directive(ChannelFilterComponent)
      );
      channelFilter.triggerEventHandler('selectedChannel', 'All');
      component.messages$.subscribe(messages => {
        expect(messages).toEqual(mockMessages);
        done();
      });
    });
  });

  it('should display messages', () => {
    jest
      .spyOn(websocketService, 'getMessages')
      .mockReturnValue(of(mockMessages));
    fixture.detectChanges();
    const messagesComponent = fixture.debugElement.query(
      By.directive(MessagesComponent)
    );
    expect(messagesComponent).toBeTruthy();
  });

  it('should display unsubscription form if there is channel subscribed', () => {
    jest
      .spyOn(socketSetupService, 'getSocketSetup')
      .mockReturnValue(of(mockSocketSetup));
    component.showForm = false;
    jest.spyOn(websocketService, 'getChannels').mockReturnValue(of(['events']));
    fixture.detectChanges();
    const unsubscriptionForm = fixture.debugElement.query(
      By.directive(UnsubscriptionFormComponent)
    );
    expect(unsubscriptionForm).toBeTruthy();
  });

  it('should not display unsubscription form if there is no subscribed channel', () => {
    jest
      .spyOn(socketSetupService, 'getSocketSetup')
      .mockReturnValue(of(mockSocketSetup));
    component.showForm = false;
    jest.spyOn(websocketService, 'getChannels').mockReturnValue(of([]));
    fixture.detectChanges();
    const unsubscriptionForm = fixture.debugElement.query(
      By.directive(UnsubscriptionFormComponent)
    );
    expect(unsubscriptionForm).toBeFalsy();
  });

  it('should leaveChannel on unsubscriptionForm submit', () => {
    jest
      .spyOn(socketSetupService, 'getSocketSetup')
      .mockReturnValue(of(mockSocketSetup));
    jest.spyOn(websocketService, 'leaveChannel');
    const channel = 'events';
    component.showForm = false;
    jest.spyOn(websocketService, 'getChannels').mockReturnValue(of(['events']));
    fixture.detectChanges();
    const unsubscriptionForm = fixture.debugElement.query(
      By.directive(UnsubscriptionFormComponent)
    );
    unsubscriptionForm.triggerEventHandler('unsubscribedChannel', channel);
    expect(websocketService.leaveChannel).toHaveBeenCalledWith(channel);
  });

  it('should display message form if there is channel subscribed', () => {
    jest
      .spyOn(socketSetupService, 'getSocketSetup')
      .mockReturnValue(of(mockSocketSetup));
    component.showForm = false;
    jest.spyOn(websocketService, 'getChannels').mockReturnValue(of(['events']));
    fixture.detectChanges();
    const messageForm = fixture.debugElement.query(
      By.directive(MessageFormComponent)
    );
    expect(messageForm).toBeTruthy();
  });

  it('should not display message form if there is no subscribed channel', () => {
    jest
      .spyOn(socketSetupService, 'getSocketSetup')
      .mockReturnValue(of(mockSocketSetup));
    component.showForm = false;
    jest.spyOn(websocketService, 'getChannels').mockReturnValue(of([]));
    fixture.detectChanges();
    const messageForm = fixture.debugElement.query(
      By.directive(MessageFormComponent)
    );
    expect(messageForm).toBeFalsy();
  });

  it('should send message if message form was submitted', () => {
    const message: SentMessage = {
      date: new Date(),
      channel: 'test',
      data: { msg: 'test' },
      sent: true,
    };
    jest
      .spyOn(socketSetupService, 'getSocketSetup')
      .mockReturnValue(of(mockSocketSetup));
    jest.spyOn(websocketService, 'sendMessage');
    component.showForm = false;
    jest.spyOn(websocketService, 'getChannels').mockReturnValue(of(['events']));
    fixture.detectChanges();
    const messageForm = fixture.debugElement.query(
      By.directive(MessageFormComponent)
    );
    messageForm.triggerEventHandler('messageSent', message);
    expect(websocketService.sendMessage).toHaveBeenCalledWith(message);
  });

  it('should allow multiple accordions to be open', async () => {
    component.showForm = false;
    jest.spyOn(websocketService, 'getChannels').mockReturnValue(of(['events']));
    jest
      .spyOn(socketSetupService, 'getSocketSetup')
      .mockReturnValue(of(mockSocketSetup));
    fixture.detectChanges();
    const accordionHarness = await loader.getHarness(MatAccordionHarness);
    expect(await accordionHarness.isMulti()).toEqual(true);
  });

  it('should display only one expansion panel if no channel is subscribed', async () => {
    component.showForm = false;
    jest.spyOn(websocketService, 'getChannels').mockReturnValue(of([]));
    jest
      .spyOn(socketSetupService, 'getSocketSetup')
      .mockReturnValue(of(mockSocketSetup));
    fixture.detectChanges();
    const accordionHarness = await loader.getHarness(MatAccordionHarness);
    const expansionPanels = await accordionHarness.getExpansionPanels();
    expect(expansionPanels.length).toEqual(1);
    expect(await expansionPanels[0].getTitle()).toEqual('Subscription');
  });

  it('should display 3 expansion panels if there is channel subscribed', async () => {
    component.showForm = false;
    jest.spyOn(websocketService, 'getChannels').mockReturnValue(of(['events']));
    jest
      .spyOn(socketSetupService, 'getSocketSetup')
      .mockReturnValue(of(mockSocketSetup));
    fixture.detectChanges();
    const accordionHarness = await loader.getHarness(MatAccordionHarness);
    const expansionPanels = await accordionHarness.getExpansionPanels();
    expect(expansionPanels.length).toEqual(3);
    expect(await expansionPanels[0].getTitle()).toEqual('Subscription');
    expect(await expansionPanels[1].getTitle()).toEqual('Unsubscription');
    expect(await expansionPanels[2].getTitle()).toEqual('Send message');
  });
});
