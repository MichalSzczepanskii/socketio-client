import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client.component';
import { SetupFormComponent } from '../ui/setup-form/setup-form.component';
import { LogsComponent } from '../ui/logs/logs.component';
import { SetupInfoComponent } from '../ui/setup-info/setup-info.component';
import { SubscriptionFormComponent } from '../ui/subscription-form/subscription-form.component';
import { ChannelFilterComponent } from '../ui/channel-filter/channel-filter.component';
import { MessagesComponent } from '../ui/messages/messages.component';
import { UnsubscriptionFormComponent } from '../ui/unsubscription-form/unsubscription-form.component';

@NgModule({
  declarations: [ClientComponent],
  imports: [
    CommonModule,
    ClientRoutingModule,
    SetupFormComponent,
    LogsComponent,
    SetupInfoComponent,
    SubscriptionFormComponent,
    ChannelFilterComponent,
    MessagesComponent,
    UnsubscriptionFormComponent,
  ],
})
export class ClientModule {}
