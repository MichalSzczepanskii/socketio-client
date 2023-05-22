import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client.component';
import { SetupFormComponent } from '../ui/setup-form/setup-form.component';
import { SpinnerComponent } from '../../shared/ui/spinner/spinner.component';
import { LogsComponent } from '../ui/logs/logs.component';
import { SetupInfoComponent } from '../ui/setup-info/setup-info.component';

@NgModule({
  declarations: [ClientComponent],
  imports: [
    CommonModule,
    ClientRoutingModule,
    SetupFormComponent,
    SpinnerComponent,
    LogsComponent,
    SetupInfoComponent,
  ],
})
export class ClientModule {}
