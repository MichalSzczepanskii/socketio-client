import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupFormComponent } from './setup-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import {
  findEl,
  markFieldAsBlurred,
  setFieldValue,
} from '../../../spec-helper/element.utils';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocketSetup } from '../../data-access/models/socket-setup';

describe('SetupFormComponent', () => {
  let component: SetupFormComponent;
  let fixture: ComponentFixture<SetupFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule.withConfig({ disableAnimations: true }),
        SetupFormComponent,
        ReactiveFormsModule,
        MatInputModule,
      ],
    });
    fixture = TestBed.createComponent(SetupFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should submit the form successfully', () => {
    jest.spyOn(component.submittedData, 'emit');
    fixture.detectChanges();
    const url = 'ws://localhost:3000';
    const config = {
      query: {
        bearerToken: 'abc',
      },
    };
    setFieldValue(fixture, 'urlField', url);
    markFieldAsBlurred(fixture, 'urlField');
    const configField = findEl(fixture, 'configField');
    configField.componentInstance.set(config);
    configField.componentInstance.onChange();
    fixture.detectChanges();
    expect(findEl(fixture, 'submitButton').properties['disabled']).toBe(false);
    findEl(fixture, 'form').triggerEventHandler('submit', {});

    expect(component.submittedData.emit).toHaveBeenCalledWith({
      url,
      config,
    });
  });

  it('should not submit an invalid form', () => {
    jest.spyOn(component.submittedData, 'emit');
    fixture.detectChanges();
    expect(findEl(fixture, 'submitButton').properties['disabled']).toBe(true);
    findEl(fixture, 'form').triggerEventHandler('submit', {});
    expect(component.submittedData.emit).not.toHaveBeenCalled();
  });

  it('should mark url field as required', () => {
    fixture.detectChanges();
    markFieldAsBlurred(fixture, 'urlField');
    fixture.detectChanges();
    expect(findEl(fixture, 'urlFieldError').nativeElement.textContent).toEqual(
      'Url field is required'
    );
  });

  it('should mark form as invalid if jsonEditor is empty', async () => {
    fixture.detectChanges();
    setFieldValue(fixture, 'urlField', 'ws://localhost:3000');
    markFieldAsBlurred(fixture, 'urlField');
    const configField = findEl(fixture, 'configField');
    configField.componentInstance.data = '';
    fixture.detectChanges();
    expect(findEl(fixture, 'submitButton').properties['disabled']).toBe(false);
  });

  it('should mark url field as invalid if wrong url passed', () => {
    fixture.detectChanges();
    setFieldValue(fixture, 'urlField', 'http://localhost:3000');
    markFieldAsBlurred(fixture, 'urlField');
    fixture.detectChanges();
    expect(findEl(fixture, 'urlFieldError').nativeElement.textContent).toEqual(
      'Url is not a valid ws address'
    );
  });

  it('should fill form with socketSetup if passed as input', () => {
    const socketSetup: SocketSetup = {
      url: 'ws://localhost:3000',
      config: {
        query: {
          bearerToken: 'abc',
        },
      },
    };
    component.socketSetup = socketSetup;
    fixture.detectChanges();
    expect(component.form.value).toEqual({
      url: socketSetup.url,
      config: socketSetup.config,
    });
  });
});
