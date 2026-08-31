import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IOrderDetails } from '../../../../core/interface/IOrder';

@Component({
  selector: 'app-order-items',
  standalone: false,
  templateUrl: './order-items.html',
  styleUrl: './order-items.scss',
})
export class OrderItems {
  @Input({ required: true }) order!: IOrderDetails;
  @Input() editMode = false;
  @Input() discountControl: FormControl<number | null> | null = null;
  get totalQuantity(): number {
    return this.order.items.reduce((total, item) => total + item.quantity, 0);
  }
  get subtotal(): number {
    return this.order.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }
  get total(): number {
    const discount =
      this.editMode && this.discountControl != null
        ? (this.discountControl.value ?? 0)
        : this.order.discount;
    return this.subtotal - discount;
  }
  hasRenderableImage(image: string | null | undefined): boolean {
    return typeof image === 'string' && !image.startsWith('assets/img/products/');
  }
}
