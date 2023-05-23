import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionFormComponent } from './subscription-form.component';
import {
  findEl,
  markFieldAsBlurred,
  setFieldValue,
} from '../../../spec-helper/element.utils';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SubscriptionFormComponent', () => {
  let component: SubscriptionFormComponent;
  let fixture: ComponentFixture<SubscriptionFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SubscriptionFormComponent,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule.withConfig({ disableAnimations: true }),
      ],
    });
    fixture = TestBed.createComponent(SubscriptionFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should submit the form successfully', () => {
    const channelName = 'events';
    jest.spyOn(component.channelSubscribed, 'emit');
    fixture.detectChanges();

    setFieldValue(fixture, 'channelField', channelName);
    markFieldAsBlurred(fixture, 'channelField');
    fixture.detectChanges();

    expect(findEl(fixture, 'submitButton').properties['disabled']).toBe(false);
    findEl(fixture, 'form').triggerEventHandler('submit', {});
    expect(component.channelSubscribed.emit).toHaveBeenCalledWith(channelName);
    expect(findEl(fixture, 'channelField').nativeElement.value).toEqual('');
    expect(component.form.pristine).toEqual(true);
    expect(component.form.errors).toEqual(null);
  });

  it('should not submit an invalid form', () => {
    jest.spyOn(component.channelSubscribed, 'emit');
    fixture.detectChanges();
    expect(findEl(fixture, 'submitButton').properties['disabled']).toBe(true);
    findEl(fixture, 'form').triggerEventHandler('submit', {});
    expect(component.channelSubscribed.emit).not.toHaveBeenCalled();
  });
});
