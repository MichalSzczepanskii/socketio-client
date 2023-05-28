import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'socketio-client-subscription-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
  template: `
    <form
      [formGroup]="form"
      data-cy="form"
      (ngSubmit)="subscribeToChannel()"
      #formDirective="ngForm">
      <mat-form-field>
        <mat-label>Channel</mat-label>
        <input
          type="text"
          matInput
          data-cy="channelField"
          formControlName="channel" />
      </mat-form-field>
      <div>
        <button
          type="submit"
          mat-raised-button
          color="primary"
          data-cy="submitButton"
          [disabled]="form.invalid">
          Subscribe
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      mat-form-field {
        width: 100%;
      }
    `,
  ],
})
export class SubscriptionFormComponent implements OnInit {
  @Output() channelSubscribed: EventEmitter<string> =
    new EventEmitter<string>();
  form!: FormGroup;
  @ViewChild('formDirective') private formDirective!: NgForm;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      channel: [null, Validators.required],
    });
  }

  subscribeToChannel() {
    if (this.form.invalid) return;
    this.channelSubscribed.emit(this.form.get('channel')?.value);
    this.form.reset();
    this.formDirective.resetForm();
  }
}
