import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client.component';
import { SetupFormComponent } from '../ui/setup-form/setup-form.component';

@NgModule({
  declarations: [ClientComponent],
  imports: [CommonModule, ClientRoutingModule, SetupFormComponent],
})
export class ClientModule {}
