import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationComponentPage } from './reservation-component-page/reservation-component-page';

const routes: Routes = [
  {
    path: '',
    component: ReservationComponentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservationRoutingModule { }
