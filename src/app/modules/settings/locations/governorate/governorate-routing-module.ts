import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GovernoratePage } from './governorate-page/governorate-page';

const routes: Routes = [
  {
    path: '',
    component: GovernoratePage,
    data: { title: 'المحافظات' },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GovernorateRoutingModule {}
