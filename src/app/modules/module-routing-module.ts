import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./dashboard/dashboard-module').then(m => m.DashboardModule)
  },
  {
    path: 'sliders',
    loadChildren: () => import('./sliders/sliders-module').then(m => m.SlidersModule)
  },
  {
    path: 'reservation',
    loadChildren: () => import('./reservation/reservation-module').then(m => m.ReservationModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModuleRoutingModule { }
