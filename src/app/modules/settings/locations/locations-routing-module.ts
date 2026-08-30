import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationsShell } from './locations-shell/locations-page';
import { RegionPage } from './region/region-page/region-page';
import { GovernoratePage } from './governorate/governorate-page/governorate-page';

const routes: Routes = [

  {
    path: '',
    component: LocationsShell,
    children: [
      { path: '', redirectTo: 'governorate', pathMatch: 'full' },
      { path: 'governorate', component: GovernoratePage },
      { path: 'region', component: RegionPage }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationsRoutingModule { }
