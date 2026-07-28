import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponant } from './layout-componant/layout-componant';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'layout',
    pathMatch: 'full'
  }
  ,
  {
    path: 'layout',
    component: LayoutComponant,
    children: [
      { path: '', loadChildren: () => import('../modules/module-routing-module').then(m => m.ModuleRoutingModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutModuleRoutingModule {}
