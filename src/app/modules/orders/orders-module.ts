import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing-module';
import { OrdersPage } from './pages/orders-page/orders-page';
import { OrdersDetails } from './components/orders-details/orders-details';
import { SharedModule } from '../shared/shared-module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OrderConfermation } from './modal/order-confermation/order-confermation';
import { OrderDetailsPage } from './pages/order-details-page/order-details-page';
import { OrderCustomerInfo } from './components/order-customer-info/order-customer-info';
import { OrderItems } from './components/order-items/order-items';

@NgModule({
  declarations: [
    OrdersPage,
    OrdersDetails,
    OrderConfermation,
    OrderDetailsPage,
    OrderCustomerInfo,
    OrderItems,
  ],
  imports: [CommonModule, OrdersRoutingModule, SharedModule, ReactiveFormsModule, FormsModule],
})
export class OrdersModule {}
