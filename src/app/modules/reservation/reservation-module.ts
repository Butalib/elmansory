import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReservationRoutingModule } from './reservation-routing-module';
import { ReservationComponentPage } from './reservation-component-page/reservation-component-page';
import { ReservationModel } from './reservation-model/reservation-model';
import { SharedModule } from '../shared/shared-module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ReservationComponentPage, ReservationModel],
  imports: [CommonModule, ReservationRoutingModule, SharedModule, ReactiveFormsModule],
})
export class ReservationModule { }
