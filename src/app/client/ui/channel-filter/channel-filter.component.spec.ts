import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelFilterComponent } from './channel-filter.component';
import { By } from '@angular/platform-browser';
import { MatChipsModule } from '@angular/material/chips';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatChipOptionHarness } from '@angular/material/chips/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

describe('ChannelFilterComponent', () => {
  let component: ChannelFilterComponent;
  let fixture: ComponentFixture<ChannelFilterComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ChannelFilterComponent, MatChipsModule],
    });
    fixture = TestBed.createComponent(ChannelFilterComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should print each channel with chips', () => {
    const channels = ['events', 'test'];
    component.channels = channels;
    fixture.detectChanges();
    const chips = fixture.debugElement.queryAll(By.css('mat-chip-option'));
    expect(chips.length).toEqual(3);
    chips.slice(1).forEach((el, index) => {
      expect(el.nativeElement.textContent).toEqual(channels[index]);
    });
  });

  it('should highlight all chip', () => {
    component.channels = ['events', 'test'];
    fixture.detectChanges();
    const chips = fixture.debugElement.queryAll(By.css('mat-chip-option'));
    expect(chips[0].componentInstance.selected).toEqual(true);
  });

  it('should emit event name on click', async () => {
    jest.spyOn(component.selectedChannel, 'emit');
    component.channels = ['events', 'test'];
    fixture.detectChanges();
    const chips = await loader.getAllHarnesses(MatChipOptionHarness);
    await chips[1].select();
    expect(component.selectedChannel.emit).toHaveBeenCalledWith('events');
  });
});
