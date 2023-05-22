import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { ClientComponent } from './client.component';
import { MockComponent } from 'ng-mocks';
import { SetupFormComponent } from '../ui/setup-form/setup-form.component';
import { By } from '@angular/platform-browser';
import { Socket } from 'socket.io-client';
import { findEl, getTestIdSelector } from '../../spec-helper/element.utils';
import { SocketSetup } from '../data-access/models/socket-setup';

describe('ClientComponent', () => {
  let component: ClientComponent;
  let fixture: ComponentFixture<ClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientComponent],
      imports: [MockComponent(SetupFormComponent)],
    });
    fixture = TestBed.createComponent(ClientComponent);
    component = fixture.componentInstance;
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
});
