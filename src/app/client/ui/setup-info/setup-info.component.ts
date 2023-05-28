import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketSetup } from '../../data-access/models/socket-setup';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-json';

@Component({
  selector: 'socketio-client-setup-info',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule],
  templateUrl: './setup-info.component.html',
  styleUrls: ['./setup-info.component.scss'],
})
export class SetupInfoComponent implements AfterViewInit {
  @Input({ required: true })
  socketSetup!: SocketSetup;
  @Output()
  disconnectClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('jsonCode')
  jsonCode!: ElementRef;

  disconnect() {
    this.disconnectClicked.emit(true);
  }

  ngAfterViewInit() {
    Prism.highlightElement(this.jsonCode.nativeElement);
  }
}
