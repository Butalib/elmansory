import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfitsPage } from './profits-page/profits-page';

const routes: Routes = [
  {
    path: '',
    component: ProfitsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfitsRoutingModule { }
