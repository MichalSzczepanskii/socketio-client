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
    setFieldValue(fixture, 'configField', JSON.stringify(config));
    markFieldAsBlurred(fixture, 'configField');
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

  it('should mark config field as invalid', () => {
    fixture.detectChanges();
    setFieldValue(fixture, 'configField', '{"key": "value');
    markFieldAsBlurred(fixture, 'configField');
    fixture.detectChanges();
    expect(
      findEl(fixture, 'configFieldError').nativeElement.textContent
    ).toEqual('Config is not a valid json');
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
});
