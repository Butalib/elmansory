import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashbourdPage } from './page/dashbourd-page/dashbourd-page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashbourd',
    pathMatch: 'full'
  },
  { 
    path: 'dashbourd',
    component: DashbourdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
