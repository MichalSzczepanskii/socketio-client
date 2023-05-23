import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsubscriptionFormComponent } from './unsubscription-form.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { findEl } from '../../../spec-helper/element.utils';

describe('UnsubscriptionFormComponent', () => {
  let component: UnsubscriptionFormComponent;
  let fixture: ComponentFixture<UnsubscriptionFormComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        UnsubscriptionFormComponent,
        BrowserAnimationsModule.withConfig({ disableAnimations: true }),
      ],
    });
    fixture = TestBed.createComponent(UnsubscriptionFormComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
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

  it('should pass the form successfully', async () => {
    const channelToEmit = 'events';
    jest.spyOn(component.unsubscribedChannel, 'emit');
    component.channels = [channelToEmit, 'test'];
    fixture.detectChanges();
    const select = await loader.getHarness(MatSelectHarness);
    await select.open();
    await select.clickOptions({ text: channelToEmit });
    fixture.detectChanges();
    expect(findEl(fixture, 'submitButton').properties['disabled']).toBe(false);
    findEl(fixture, 'form').triggerEventHandler('submit', {});
    expect(component.unsubscribedChannel.emit).toHaveBeenCalledWith(
      channelToEmit
    );
    expect(component.form.value).toEqual({ channel: null });
  });

  it('should handle an invalid form', () => {
    jest.spyOn(component.unsubscribedChannel, 'emit');
    component.channels = ['events', 'test'];
    fixture.detectChanges();
    expect(findEl(fixture, 'submitButton').properties['disabled']).toBe(true);
    findEl(fixture, 'form').triggerEventHandler('submit', {});
    expect(component.unsubscribedChannel.emit).not.toHaveBeenCalled();
  });
});
