import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersPage } from './orders-page/orders-page';
import { OrderDetailsPage } from './order-details-page/order-details-page';

const routes: Routes = [
  {
    path: '',
    component: OrdersPage,
    data: { title: 'الطلبات' },
  },
  {
    path: 'details/:id',
    component: OrderDetailsPage,
    data: { title: 'تفاصيل الطلب' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule {}
