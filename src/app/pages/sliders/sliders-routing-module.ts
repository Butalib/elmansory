import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SlidersPage } from './sliders-page/sliders-page';

const routes: Routes = [
  {
  path: '',
  component: SlidersPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SlidersRoutingModule {}
