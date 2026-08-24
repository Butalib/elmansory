import { Component, inject, OnInit } from '@angular/core';
import { IOrder, IOrderDetails } from '../../../../core/interface/IOrder';
import { OrdersService } from '../../../../core/service/orders.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-details-page',
  standalone: false,
  templateUrl: './order-details-page.html',
  styleUrl: './order-details-page.scss',
})
export class OrderDetailsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly ordersService = inject(OrdersService);

  order: IOrderDetails | null = null;

  ngOnInit(): void {

    const orderId = this.route.snapshot.paramMap.get('id');
    if (!orderId) {
      return;
    }
    this.ordersService.getOrderDetails(orderId!).subscribe({
      next: (order) => {
        this.order = order;
        console.log(orderId + ' ' + JSON.stringify(this.order));
      },
      error: (error) => {
        console.error('Error fetching order details:', error);
      },
    });
  }
}
