import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing-module';
import { OrdersPage } from './orders-page/orders-page';
import { SharedModule } from '../shared/shared-module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OrderConfermation } from './modal/order-confermation/order-confermation';
// import { OrderCustomerInfo } from './components/order-customer-info/order-customer-info';
import { OrderItems } from './components/order-items/order-items';
import { OrderDetailsModal } from './modal/order-details-modal/order-details-modal';
import { OrderDetailsPage } from './order-details-page/order-details-page';

@NgModule({
  declarations: [OrdersPage, OrderConfermation, OrderItems, OrderDetailsModal, OrderDetailsPage],
  imports: [CommonModule, OrdersRoutingModule, SharedModule, ReactiveFormsModule, FormsModule],
})
export class OrdersModule {}
