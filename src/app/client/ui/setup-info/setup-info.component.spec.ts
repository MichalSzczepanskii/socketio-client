import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupInfoComponent } from './setup-info.component';
import { SocketSetup } from '../../data-access/models/socket-setup';
import { findEl } from '../../../spec-helper/element.utils';
import { MatButtonModule } from '@angular/material/button';
import { JsonPipe } from '@angular/common';

describe('SetupInfoComponent', () => {
  let component: SetupInfoComponent;
  let fixture: ComponentFixture<SetupInfoComponent>;
  let jsonPipe: JsonPipe;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupInfoComponent, MatButtonModule],
      providers: [JsonPipe],
    });
    fixture = TestBed.createComponent(SetupInfoComponent);
    component = fixture.componentInstance;
    jsonPipe = TestBed.inject(JsonPipe);
  });

  describe('Passing Input', () => {
    const socketSetup: SocketSetup = {
      url: 'wss://localhost:8080',
      config: {
        query: {
          bearerToken: 'abc',
        },
      },
    };

    beforeEach(() => {
      component.socketSetup = socketSetup;
      fixture.detectChanges();
    });

    it('should display url, config and disconnect button', () => {
      const url = findEl(fixture, 'urlInfo');
      const config = findEl(fixture, 'configInfo');
      const disconnectButton = findEl(fixture, 'disconnectButton');
      expect(url.nativeElement.textContent).toEqual(socketSetup.url);
      expect(config.nativeElement.textContent).toEqual(
        '    ' + jsonPipe.transform(socketSetup.config) + '\n  '
      );
      expect(disconnectButton).toBeTruthy();
    });

    it('should emit event emitter when disconnect button is clicked', () => {
      jest.spyOn(component.disconnectClicked, 'emit');
      const disconnectButton = findEl(fixture, 'disconnectButton');
      disconnectButton.nativeElement.click();
      expect(component.disconnectClicked.emit).toHaveBeenCalledWith(true);
    });
  });
});
