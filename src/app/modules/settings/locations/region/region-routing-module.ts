import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegionPage } from './region-page/region-page';

const routes: Routes = [
  {
    path: '',
    component: RegionPage,
    data: { title: 'المناطق' },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegionRoutingModule { }
