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

describe('ClientComponent', () => {
  let component: ClientComponent;
  let fixture: ComponentFixture<ClientComponent>;
  let loggerService: LoggerService;
  let websocketService: WebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientComponent],
      imports: [
        MockComponents(
          SetupFormComponent,
          LogsComponent,
          SetupInfoComponent,
          SubscriptionFormComponent
        ),
      ],
      providers: [MockProviders(LoggerService, WebsocketService)],
    });
    fixture = TestBed.createComponent(ClientComponent);
    component = fixture.componentInstance;
    loggerService = TestBed.inject(LoggerService);
    websocketService = TestBed.inject(WebsocketService);
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
      fixture.detectChanges();
      const setupForm = fixture.debugElement.query(
        By.directive(SetupFormComponent)
      );
      setupForm.triggerEventHandler('submittedData', socketSetup);
      tick();
    }));

    it('should save socketSetup to variable on emit from setup-form', () => {
      expect(component.socketSetup).toEqual(socketSetup);
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
      component.showForm = false;
      component.socketSetup = socketSetup;
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
    component.showForm = false;
    component.socketSetup = {
      url: 'test',
      config: { query: { bearerToken: 'abc' } },
    };
    fixture.detectChanges();
    const setupInfoComponent = fixture.debugElement.query(
      By.directive(SetupInfoComponent)
    );
    expect(setupInfoComponent).toBeTruthy();
    expect(setupInfoComponent.componentInstance.socketSetup).toEqual(
      component.socketSetup
    );
  });

  it('should display subscription-form if socketSetup is defined', () => {
    component.showForm = false;
    component.socketSetup = {
      url: 'test',
      config: { query: { bearerToken: 'abc' } },
    };
    fixture.detectChanges();
    const subscriptionForm = fixture.debugElement.query(
      By.directive(SubscriptionFormComponent)
    );
    expect(subscriptionForm).toBeTruthy();
  });

  it('should call websocketService.subscribe with channel emitted from subscription-form', () => {
    jest.spyOn(websocketService, 'joinChannel');
    component.showForm = false;
    component.socketSetup = {
      url: 'test',
      config: { query: { bearerToken: 'abc' } },
    };
    fixture.detectChanges();
    const subscriptionForm = fixture.debugElement.query(
      By.directive(SubscriptionFormComponent)
    );
    const channelName = 'events';
    subscriptionForm.triggerEventHandler('channelSubscribed', channelName);
    expect(websocketService.joinChannel).toHaveBeenCalledWith(channelName);
  });
});
