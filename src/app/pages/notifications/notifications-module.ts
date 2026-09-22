import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationsRoutingModule } from './notifications-routing-module';
import { NotificationPage } from './notification-page/notification-page';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [NotificationPage],
  imports: [CommonModule, NotificationsRoutingModule, ReactiveFormsModule],
})
export class NotificationsModule { }
