import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsPage } from './products-page/products-page';

const routes: Routes = [
  {
    path: '',
    component: ProductsPage,
    children: [
      {
        path: '',
        redirectTo: 'notebooks',
        pathMatch: 'full',
      },
      {
        path: 'notebooks',
        loadChildren: () =>
          import('./notebooks/notebooks-module').then((m) => m.NotebooksModule),
      },
      {
        path: 'stationery',
        loadChildren: () =>
          import('./stationery/stationery-module').then((m) => m.StationeryModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
