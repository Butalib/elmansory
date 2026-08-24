import { Component, Input } from '@angular/core';
import { IOrder, IOrderDetails } from '../../../../core/interface/IOrder';

@Component({
  selector: 'app-order-customer-info',
  standalone: false,
  templateUrl: './order-customer-info.html',
  styleUrl: './order-customer-info.scss',
})
export class OrderCustomerInfo {
  @Input({ required: true }) order!: IOrderDetails;
  @Input() avatar: string = '';
}
