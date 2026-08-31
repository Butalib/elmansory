import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { IOrderDetails } from '../../../../core/interface/IOrder';

@Component({
  selector: 'app-order-details-modal',
  standalone: false,
  templateUrl: './order-details-modal.html',
  styleUrl: './order-details-modal.scss',
})
export class OrderDetailsModal implements OnChanges {
  private readonly fb = inject(FormBuilder);

  @Input() isOpen = false;
  @Input() order: IOrderDetails | null = null;
  @Input() mode: 'view' | 'edit' = 'view';
  @Input() isSaving = false;


  @Output() closed = new EventEmitter<void>();
  @Output() switchToEdit = new EventEmitter<void>();
  @Output() backToView = new EventEmitter<void>();


  @Output() saveDiscount = new EventEmitter<{ orderId: string; discount: number }>();
  @Output() acceptOrder = new EventEmitter<string>();
  @Output() requestDelete = new EventEmitter<string>();
  @Output() toggleActive = new EventEmitter<{ orderId: string; value: boolean }>();


  readonly discountControl: FormControl<number | null> = this.fb.control<number | null>(0, [
    Validators.required,
    Validators.min(0),
  ]);

  readonly statusConfig: Record<string, { text: string; bgColor: string; textColor: string }> = {
    pending: { text: 'قيد المراجعة', bgColor: 'var(--color-warning-100)', textColor: 'var(--color-secondary-500)' },
    accepted: { text: 'تم القبول', bgColor: 'var(--color-success-100)', textColor: 'var(--color-success-700)' },
    rejected: { text: 'مرفوض', bgColor: 'var(--color-error-100)', textColor: 'var(--color-error-600)' },
  };


  get modalTitle(): string {
    return this.mode === 'view' ? 'تفاصيل الطلب' : 'تعديل الطلب';
  }

  get cancelLabel(): string {
    return this.mode === 'view' ? 'رفض' : 'رجوع';
  }

  get confirmLabel(): string {
    return this.mode === 'view' ? 'قبول' : 'حفظ';
  }

  get confirmTheme(): 'primary' | 'success' | 'error' {
    return this.mode === 'view' ? 'success' : 'primary';
  }

  get isConfirmDisabled(): boolean {
    if (this.isSaving) return true;
    if (this.mode === 'edit') {
      return this.discountControl.invalid || this.discountControl.value === null;
    }
    return false;
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['order'] && this.order != null) {
      this.discountControl.setValue(this.order.discount);
    }
    if (changes['mode'] && this.mode === 'edit' && this.order != null) {
      this.discountControl.setValue(this.order.discount);
    }
    if (changes['isOpen'] && !this.isOpen) {
      this.discountControl.setValue(0);
      this.discountControl.markAsUntouched();
    }
  }


  handleClose(): void {
    if (this.mode === 'edit') {

      this.backToView.emit();
    } else {

      this.closed.emit();
    }
  }


  handleConfirm(): void {
    if (this.mode === 'edit') {
      if (!this.order || this.discountControl.invalid) return;
      this.saveDiscount.emit({
        orderId: this.order.id,
        discount: this.discountControl.value ?? 0,
      });
    } else {

      if (!this.order) return;
      this.acceptOrder.emit(this.order.id);
    }
  }
}
