import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SocketSetup } from '../../data-access/models/socket-setup';
import { wsAddressValidator } from '../../data-access/validators/ws-address/ws-address.validator';
import { JsonEditorOptions, NgJsonEditorModule } from 'ang-jsoneditor';

@Component({
  selector: 'socketio-client-setup-form',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgJsonEditorModule,
  ],
  templateUrl: './setup-form.component.html',
  styleUrls: ['./setup-form.component.scss'],
})
export class SetupFormComponent implements OnInit {
  @Output() submittedData: EventEmitter<SocketSetup> =
    new EventEmitter<SocketSetup>();
  form!: FormGroup;
  @Input()
  socketSetup?: SocketSetup | null;
  jsonEditorOptions!: JsonEditorOptions;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      url: [this.socketSetup?.url, [Validators.required, wsAddressValidator]],
      config: [this.socketSetup?.config],
    });
    this.jsonEditorOptions = new JsonEditorOptions();
    this.jsonEditorOptions.mode = 'code';
  }

  submitForm() {
    if (this.form.invalid) return;
    this.submittedData.emit({
      url: this.form.get('url')?.value,
      config: this.form.get('config')?.value,
    });
  }

  get fc() {
    return this.form.controls;
  }
}
