import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { ClientComponent } from './client.component';
import { MockComponents, MockProvider } from 'ng-mocks';
import { SetupFormComponent } from '../ui/setup-form/setup-form.component';
import { By } from '@angular/platform-browser';
import { Socket } from 'socket.io-client';
import { findEl, getTestIdSelector } from '../../spec-helper/element.utils';
import { SocketSetup } from '../data-access/models/socket-setup';
import { LoggerService } from '../data-access/services/logger/logger.service';
import { of } from 'rxjs';
import { LogType } from '../data-access/enums/log-type';
import { LogsComponent } from '../ui/logs/logs.component';

describe('ClientComponent', () => {
  let component: ClientComponent;
  let fixture: ComponentFixture<ClientComponent>;
  let loggerService: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientComponent],
      imports: [MockComponents(SetupFormComponent, LogsComponent)],
      providers: [MockProvider(LoggerService)],
    });
    fixture = TestBed.createComponent(ClientComponent);
    component = fixture.componentInstance;
    loggerService = TestBed.inject(LoggerService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display setup-form component if socket is undefined', () => {
    component.socket = undefined;
    fixture.detectChanges();
    const setupForm = fixture.debugElement.query(
      By.directive(SetupFormComponent)
    );
    const title = findEl(fixture, 'setupFormTitle');
    expect(setupForm).toBeTruthy();
    expect(title).toBeTruthy();
  });

  it('should not display setup-form component if socket is defined', () => {
    component.socket = { id: 'test' } as Socket;
    fixture.detectChanges();
    const setupForm = fixture.debugElement.query(
      By.directive(SetupFormComponent)
    );
    const title = fixture.debugElement.query(
      By.css(getTestIdSelector('setupFormTitle'))
    );
    expect(setupForm).toBeFalsy();
    expect(title).toBeFalsy();
  });

  it('should save socketSetup to variable on emit from setup-form', fakeAsync(() => {
    const socketSetup: SocketSetup = { url: 'test' };
    fixture.detectChanges();
    const setupForm = fixture.debugElement.query(
      By.directive(SetupFormComponent)
    );
    setupForm.triggerEventHandler('submittedData', socketSetup);
    tick();
    expect(component.socketSetup).toEqual(socketSetup);
  }));

  it('should display logs', () => {
    jest
      .spyOn(loggerService, 'getLogs')
      .mockReturnValue(of([{ type: LogType.INFO, content: 'test message' }]));
    fixture.detectChanges();
    const logsComponent = fixture.debugElement.query(
      By.directive(LogsComponent)
    );
    expect(logsComponent).toBeTruthy();
  });
});
