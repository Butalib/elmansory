import { Component, Input } from '@angular/core';
import { IOrderDetails, IOrderItem } from '../../../../core/interface/IOrder';

@Component({
  selector: 'app-order-items',
  standalone: false,
  templateUrl: './order-items.html',
  styleUrl: './order-items.scss',
})
export class OrderItems {
   @Input({ required: true }) order!: IOrderDetails;

  get totalQuantity(): number {
    return this.order.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  get subtotal(): number {
    return this.order.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  get total(): number {
    return this.subtotal - this.order.discount;
  }
}
