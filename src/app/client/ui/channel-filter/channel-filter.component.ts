import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipListboxChange, MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'socketio-client-channel-filter',
  standalone: true,
  imports: [CommonModule, MatChipsModule],
  template: `
    <mat-chip-listbox (change)="selectChannel($event)">
      <mat-chip-option [selected]="true">All</mat-chip-option>
      <mat-chip-option *ngFor="let channel of channels">{{
        channel
      }}</mat-chip-option>
    </mat-chip-listbox>
  `,
  styles: [],
})
export class ChannelFilterComponent {
  @Input({ required: true })
  channels!: string[];
  @Output()
  selectedChannel: EventEmitter<string> = new EventEmitter<string>();

  selectChannel(channel: MatChipListboxChange) {
    this.selectedChannel.emit(channel.value);
  }
}
