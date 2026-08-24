import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersPage } from './pages/orders-page/orders-page';
import { OrderDetailsPage } from './pages/order-details-page/order-details-page';

const routes: Routes = [
  {
    path: '',
    component: OrdersPage,
  },
  {
    path: ':id',
    component: OrderDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule { }
