import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageFormComponent } from './message-form.component';
import { MatSelectHarness } from '@angular/material/select/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  findEl,
  markFieldAsBlurred,
  setFieldValue,
} from '../../../spec-helper/element.utils';
import { JsonEditorComponent } from 'ang-jsoneditor';
import { By } from '@angular/platform-browser';
import { MatRadioGroupHarness } from '@angular/material/radio/testing';

describe('MessageFormComponent', () => {
  let component: MessageFormComponent;
  let fixture: ComponentFixture<MessageFormComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MessageFormComponent,
        BrowserAnimationsModule.withConfig({ disableAnimations: true }),
      ],
    });
    fixture = TestBed.createComponent(MessageFormComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
  });

  it('should show passed channels in select', async () => {
    const channels = ['events', 'test'];
    component.channels = channels;
    fixture.detectChanges();
    const select = await loader.getHarness(MatSelectHarness);
    await select.open();
    const options = (await select.getOptions()).map(option => option.getText());
    expect(await Promise.all(options)).toEqual(channels);
  });

  describe('radio buttons', () => {
    let radioGroupHarness: MatRadioGroupHarness;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    jest.useFakeTimers('legacy');

    beforeEach(async () => {
      fixture.detectChanges();
      radioGroupHarness = await loader.getHarness(MatRadioGroupHarness);
    });

    it('should show textarea if text radio button is true', async () => {
      component.messageType = 'json';
      await radioGroupHarness.checkRadioButton({ label: 'text' });
      const messageField = findEl(fixture, 'messageField').nativeElement;
      expect(messageField instanceof HTMLTextAreaElement).toEqual(true);
      expect(component.messageType).toEqual('text');
    });

    it('should show jsonEditor if json radio button is true', async () => {
      component.messageType = 'text';
      await radioGroupHarness.checkRadioButton({ label: 'json' });
      const messageField = findEl(fixture, 'messageField').componentInstance;
      expect(messageField instanceof JsonEditorComponent).toEqual(true);
      expect(component.messageType).toEqual('json');
    });
  });

  describe('form submission', () => {
    let selectHarness: MatSelectHarness;
    const channels = ['events', 'test'];
    const date = new Date('2023-05-24 12:00:00');

    beforeEach(async () => {
      component.channels = channels;
      fixture.detectChanges();
      selectHarness = await loader.getHarness(MatSelectHarness);
      await selectHarness.open();
      await selectHarness.close();
      jest.useFakeTimers().setSystemTime(date);
      jest.spyOn(component.messageSent, 'emit');
    });

    it('should mark channel field as required', async () => {
      fixture.detectChanges();
      const errorField = findEl(fixture, 'channelFieldError').nativeElement;
      expect(errorField.textContent).toEqual(' Channel field is required ');
    });

    describe('text message field', () => {
      beforeEach(() => {
        component.messageType = 'text';
        fixture.detectChanges();
      });

      it('should submit the form successfully', async () => {
        const message = 'test';
        await selectHarness.clickOptions({ text: channels[0] });
        setFieldValue(fixture, 'messageField', 'test');
        fixture.detectChanges();
        expect(findEl(fixture, 'submitButton').properties['disabled']).toBe(
          false
        );
        findEl(fixture, 'form').triggerEventHandler('submit', {});
        fixture.detectChanges();
        expect(component.messageSent.emit).toHaveBeenCalledWith({
          date: date,
          channel: channels[0],
          data: message,
          sent: true,
        });
        expect(component.form.value).toEqual({
          channel: null,
          message: null,
        });
        expect(component.formDirective.submitted).toEqual(false);
      });

      it('should handle an invalid form', () => {
        markFieldAsBlurred(fixture, 'channelField');
        markFieldAsBlurred(fixture, 'messageField');
        expect(findEl(fixture, 'submitButton').properties['disabled']).toBe(
          true
        );
        findEl(fixture, 'form').triggerEventHandler('submit', {});
        expect(component.messageSent.emit).not.toHaveBeenCalled();
      });
    });

    describe('json message field', () => {
      let jsonEditorComponent: JsonEditorComponent;
      beforeEach(() => {
        component.messageType = 'json';
        fixture.detectChanges();
        jsonEditorComponent = fixture.debugElement.query(
          By.directive(JsonEditorComponent)
        ).componentInstance;
      });

      it('should submit the form successfully', async () => {
        const message = {
          type: 'test',
          data: 'test',
        };
        await selectHarness.clickOptions({ text: channels[1] });
        jsonEditorComponent.set(message as any);
        jsonEditorComponent.onChange(new Event(''));
        fixture.detectChanges();
        expect(findEl(fixture, 'submitButton').properties['disabled']).toBe(
          false
        );
        findEl(fixture, 'form').triggerEventHandler('submit', {});
        fixture.detectChanges();
        expect(component.messageSent.emit).toHaveBeenCalledWith({
          date: date,
          channel: channels[1],
          data: message,
          sent: true,
        });
        expect(component.form.value).toEqual({
          channel: null,
          message: null,
        });
        expect(component.formDirective.submitted).toEqual(false);
      });

      it('should handle an invalid form', () => {
        markFieldAsBlurred(fixture, 'channelField');
        jsonEditorComponent.onChange(new Event(''));
        expect(findEl(fixture, 'submitButton').properties['disabled']).toBe(
          true
        );
        findEl(fixture, 'form').triggerEventHandler('submit', {});
        expect(component.messageSent.emit).not.toHaveBeenCalled();
      });

      it('should mark form as invalid if jsonEditor is empty', async () => {
        await selectHarness.clickOptions({ text: channels[1] });
        jsonEditorComponent.data = '';
        jsonEditorComponent.onChange(new Event(''));
        fixture.detectChanges();
        expect(findEl(fixture, 'submitButton').properties['disabled']).toBe(
          false
        );
      });
    });
  });
});
