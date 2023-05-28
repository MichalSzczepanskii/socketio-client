import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'socketio-client-unsubscription-form',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  template: `
    <h3>Unsubscribe</h3>
    <form
      [formGroup]="form"
      (ngSubmit)="unsubscribeChannel()"
      data-cy="form"
      #formDirective="ngForm">
      <mat-form-field>
        <mat-label>Channel</mat-label>
        <mat-select formControlName="channel">
          <mat-option *ngFor="let channel of channels" [value]="channel">{{
            channel
          }}</mat-option>
        </mat-select>
      </mat-form-field>
      <div>
        <button
          type="submit"
          mat-raised-button
          color="primary"
          data-cy="submitButton"
          [disabled]="form.invalid">
          Unsubscribe
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
export class UnsubscriptionFormComponent implements OnInit {
  @Input({ required: true })
  channels!: string[];
  @Output()
  unsubscribedChannel: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('formDirective')
  private formDirective!: NgForm;
  form!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      channel: [null, Validators.required],
    });
  }

  unsubscribeChannel() {
    if (this.form.invalid) return;
    this.unsubscribedChannel.emit(this.form.value['channel']);
    this.form.reset();
    this.formDirective.resetForm('');
  }
}
