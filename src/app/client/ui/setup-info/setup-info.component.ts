import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketSetup } from '../../data-access/models/socket-setup';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'socketio-client-setup-info',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule],
  templateUrl: './setup-info.component.html',
  styleUrls: ['./setup-info.component.scss'],
})
export class SetupInfoComponent {
  @Input({ required: true })
  socketSetup!: SocketSetup;
  @Output()
  disconnectClicked: EventEmitter<boolean> = new EventEmitter<boolean>();

  disconnect() {
    this.disconnectClicked.emit(true);
  }
}
