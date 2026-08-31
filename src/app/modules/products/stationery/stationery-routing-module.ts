import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StationeryPage } from './pages/stationery-page/stationery-page';
import { StationeryFormPage } from './pages/stationery-form-page/stationery-form-page';
import { StationeryDetailsPage } from './pages/stationery-details-page/stationery-details-page';

const routes: Routes = [
  {
    path: '',
    component: StationeryPage,
    pathMatch: 'full',
  },
  {
    path: 'add',
    component: StationeryFormPage,
  },
  {
    path: 'details/:id',
    component: StationeryDetailsPage,
  },
  {
    path: 'edit/:id',
    component: StationeryFormPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StationeryRoutingModule {}
