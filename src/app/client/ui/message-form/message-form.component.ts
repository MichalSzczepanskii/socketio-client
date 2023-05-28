import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import {
  JsonEditorComponent,
  JsonEditorOptions,
  NgJsonEditorModule,
} from 'ang-jsoneditor';
import { MatButtonModule } from '@angular/material/button';
import { SentMessage } from '../../data-access/models/sent-message';

@Component({
  selector: 'socketio-client-message-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatInputModule,
    NgJsonEditorModule,
    MatButtonModule,
  ],
  templateUrl: 'message-form.component.html',
  styles: [
    `
      mat-form-field {
        width: 100%;
      }
      .field {
        margin-bottom: 0.5rem;
      }
    `,
  ],
})
export class MessageFormComponent implements OnInit {
  @ViewChild(JsonEditorComponent, { static: false })
  editor?: JsonEditorComponent;
  @ViewChild('formDirective')
  formDirective!: NgForm;
  @Input({ required: true })
  channels!: string[];
  @Output()
  messageSent: EventEmitter<SentMessage> = new EventEmitter<SentMessage>();

  jsonEditorOptions!: JsonEditorOptions;
  messageType: 'text' | 'json' = 'text';
  form!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      channel: [null, Validators.required],
      message: [null, Validators.required],
    });
    this.jsonEditorOptions = new JsonEditorOptions();
    this.jsonEditorOptions.mode = 'code';
  }

  sendMessage() {
    if (this.form.invalid) return;
    this.messageSent.emit({
      date: new Date(),
      channel: this.form.value['channel'],
      data: this.form.value['message'],
      sent: true,
    });
    this.form.reset();
    this.formDirective.resetForm();
    console.log(this.formDirective);
  }
}
