import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { catchError, combineLatest, EMPTY, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IOrderDetails } from '../../../core/interface/IOrder';
import { OrdersService } from '../../../core/service/orders.service';

@Component({
  selector: 'app-order-details-page',
  standalone: false,
  templateUrl: './order-details-page.html',
  styleUrl: './order-details-page.scss',
})
export class OrderDetailsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly ordersService = inject(OrdersService);
  private readonly toaster = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly fb = inject(FormBuilder);

  order: IOrderDetails | null = null;
  isLoading = true;
  hasLoadError = false;
  mode: 'view' | 'edit' = 'view';
  isSaving = false;

  isDeleteConfirmOpen = false;
  isDeleting = false;

  readonly discountControl: FormControl<number | null> = this.fb.control<number | null>(0, [
    Validators.required,
    Validators.min(0),
  ]);

  readonly statusConfig: Record<string, { text: string; bgColor: string; textColor: string }> = {
    pending: { text: 'قيد المراجعة', bgColor: 'var(--color-warning-100)', textColor: 'var(--color-secondary-500)' },
    accepted: { text: 'تم القبول', bgColor: 'var(--color-success-100)', textColor: 'var(--color-success-700)' },
    rejected: { text: 'مرفوض', bgColor: 'var(--color-error-100)', textColor: 'var(--color-error-600)' },
  };

  ngOnInit(): void {
    combineLatest([this.route.paramMap, this.route.queryParamMap])
      .pipe(
        tap(([params, query]) => {
          this.isLoading = true;
          this.hasLoadError = false;
          this.order = null;
          this.mode = query.get('mode') === 'edit' ? 'edit' : 'view';

          if (!params.get('id')) {
            this.hasLoadError = true;
            this.isLoading = false;
          }
        }),
        switchMap(([params]) => {
          const orderId = params.get('id');
          return orderId
            ? this.ordersService.getOrderDetails(orderId).pipe(
              catchError(() => {
                this.hasLoadError = true;
                this.isLoading = false;
                this.changeDetectorRef.markForCheck();
                this.toaster.error('حدث خطأ أثناء تحميل تفاصيل الطلب');
                return EMPTY;
              }),
            )
            : EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (order) => {
          this.order = { ...order, discount: Number(order.discount) };
          this.discountControl.setValue(this.order.discount);
          this.isLoading = false;
          this.changeDetectorRef.markForCheck();
        },
      });
  }

  goBackToOrders(): void {
    this.router.navigate(['/dashboard/layout/orders']);
  }

  startEdit(): void {
    if (!this.order) return;
    this.discountControl.setValue(this.order.discount);
    this.mode = 'edit';
  }

  cancelEdit(): void {
    if (!this.order) return;
    this.discountControl.setValue(this.order.discount);
    this.mode = 'view';
  }

  saveDiscount(): void {
    if (!this.order || this.discountControl.invalid || this.discountControl.value === null) return;

    const discount = Number(this.discountControl.value);
    this.isSaving = true;

    this.ordersService.update(this.order.id, { discount }).subscribe({
      next: () => {
        this.order = { ...this.order!, discount };
        this.mode = 'view';
        this.isSaving = false;
        this.changeDetectorRef.markForCheck();
        this.toaster.success('تم تحديث الخصم بنجاح');
      },
      error: () => {
        this.isSaving = false;
        this.changeDetectorRef.markForCheck();
        this.toaster.error('حدث خطأ أثناء حفظ التعديلات');
      },
    });
  }

  toggleActive(value: boolean): void {
    if (!this.order) return;

    const currentOrder = this.order;
    this.ordersService.update(currentOrder.id, { isActive: value }).subscribe({
      next: () => {
        this.order = { ...currentOrder, isActive: value };
        this.changeDetectorRef.markForCheck();
        this.toaster.success('تم تحديث حالة الطلب');
      },
      error: () => {
        this.changeDetectorRef.markForCheck();
        this.toaster.error('حدث خطأ أثناء تحديث حالة الطلب');
      },
    });
  }

  acceptOrder(): void {
    this.updateOrderStatus('accepted', 'تم قبول الطلب بنجاح', 'الطلب مقبول بالفعل');
  }

  rejectOrder(): void {
    this.updateOrderStatus('rejected', 'تم رفض الطلب بنجاح', 'الطلب مرفوض بالفعل');
  }

  requestDelete(): void {
    this.isDeleteConfirmOpen = true;
  }

  cancelDelete(): void {
    this.isDeleteConfirmOpen = false;
    this.isDeleting = false;
  }

  confirmDelete(): void {
    if (!this.order) return;

    this.isDeleting = true;
    this.ordersService.delete(this.order.id).subscribe({
      next: () => {
        this.toaster.success('تم حذف الطلب بنجاح');
        this.isDeleteConfirmOpen = false;
        this.isDeleting = false;
        this.changeDetectorRef.markForCheck();
        this.goBackToOrders();
      },
      error: () => {
        this.isDeleting = false;
        this.changeDetectorRef.markForCheck();
        this.toaster.error('حدث خطأ أثناء الحذف');
      },
    });
  }

  private updateOrderStatus(
    status: 'accepted' | 'rejected',
    successMessage: string,
    alreadyAppliedMessage: string,
  ): void {
    if (!this.order || this.isSaving) return;

    if (this.order.status === status) {
      this.toaster.info(alreadyAppliedMessage);
      return;
    }

    this.isSaving = true;
    const currentOrder = this.order;

    this.ordersService.update(currentOrder.id, { status }).subscribe({
      next: () => {
        this.order = { ...currentOrder, status };
        this.isSaving = false;
        this.changeDetectorRef.markForCheck();
        this.toaster.success(successMessage);
      },
      error: () => {
        this.isSaving = false;
        this.changeDetectorRef.markForCheck();
        this.toaster.error('حدث خطأ أثناء تحديث حالة الطلب');
      },
    });
  }
}
