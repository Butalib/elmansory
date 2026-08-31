import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationsShell } from './locations-shell/locations-page';

const routes: Routes = [

  {
    path: '',
    component: LocationsShell,
    children: [
      { path: '', redirectTo: 'governorate', pathMatch: 'full' },
      {
        path: 'governorate',
        data: { title: 'المحافظات' },
        loadChildren: () => import('./governorate/governorate-module').then(m => m.GovernorateModule)
      },
      {
        path: 'region',
        data: { title: 'المناطق' },
        loadChildren: () => import('./region/region-module').then(m => m.RegionModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationsRoutingModule { }
