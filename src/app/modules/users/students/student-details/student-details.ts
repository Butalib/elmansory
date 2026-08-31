import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, distinctUntilChanged, EMPTY, map, switchMap, tap } from 'rxjs';
import { IOrder, IOrderDetails } from '../../../../core/interface/IOrder';
import { IStudent } from '../../../../core/interface/IStudent';
import { OrdersService } from '../../../../core/service/orders.service';
import { StudentsService } from '../../../../core/service/students.service';
import { IKpi } from '../../../../core/interface/IKpi';

@Component({
  selector: 'app-student-details',
  standalone: false,
  templateUrl: './student-details.html',
  styleUrl: './student-details.scss',
})
export class StudentDetails implements OnInit {
  readonly imageFallback = 'assets/img/dashbourd/avatar.jpg';

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly studentsService = inject(StudentsService);
  private readonly ordersService = inject(OrdersService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  // Unified State
  student: IStudent | null = null;
  orders: IOrder[] = [];
  selectedOrder: IOrderDetails | null = null;

  // Simplified UI Flags
  isLoading = true;
  hasError = false;
  isOrdersLoading = false;
  isSelectedOrderLoading = false;

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id')),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading = true;
          this.hasError = false;
          this.student = null;
          this.orders = [];
        }),
        switchMap((id) => {
          if (!id) return this.handleError();
          return this.studentsService.getById(id).pipe(
            tap((student) => {
              this.student = student;
              this.isLoading = false;
              this.isOrdersLoading = true;
              this.cdr.markForCheck();
            }),
            switchMap((student) => this.ordersService.loadAll().pipe(
              map(allOrders => this.resolveStudentOrders(allOrders, student)),
              catchError(() => {
                this.isOrdersLoading = false;
                return EMPTY;
              })
            )),
            catchError(() => this.handleError())
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((studentOrders) => {
        this.orders = studentOrders;
        this.isOrdersLoading = false;
        if (this.orders.length) this.selectOrder(this.orders[0]);
        this.cdr.markForCheck();
      });
  }

  get studentKpis(): IKpi[] {
    const totalPayments = this.orders.reduce((sum, order) => {
      if (this.isOrderDetails(order)) {
        const discount = Number(order.discount) || 0;
        const subtotal = order.items.reduce((t, item) => t + (item.price * item.quantity), 0);
        return sum + Math.max(subtotal - discount, 0);
      }
      return sum;
    }, 0);

    return [
      {
        id: '1',
        title: 'إجمالي الطلبات',
        value: this.student?.ordersCount ?? 0,
        icon: 'assets/icon/student-kpi/wallet-01.svg',
        iconBgColor: 'var(--color-primary-50)'
      },
      {
        id: '2',
        title: 'استخدامات العجلة',
        value: this.student?.wheelUses ?? 0,
        icon: 'assets/icon/student-kpi/orbit-01.svg',
        iconBgColor: 'var(--color-primary-50)'
      },
      {
        id: '3',
        title: 'إجمالي المدفوعات',
        value: totalPayments,
        icon: 'assets/icon/student-kpi/delivery-box-01.svg',
        iconBgColor: 'var(--color-primary-50)'
      }
    ];
  }

  get selectedOrderSummary() {
    if (!this.selectedOrder) return null;
    const subtotal = this.selectedOrder.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const discount = Number(this.selectedOrder.discount) || 0;
    return {
      totalProducts: this.selectedOrder.items.reduce((acc, item) => acc + item.quantity, 0),
      subtotal, discount, finalTotal: Math.max(subtotal - discount, 0)
    };
  }

  selectOrder(order: IOrder): void {
    if (this.selectedOrder?.id === order.id) return;

    this.isSelectedOrderLoading = true;
    this.selectedOrder = null;

    if (this.isOrderDetails(order)) {
      this.selectedOrder = order;
      this.isSelectedOrderLoading = false;
      return;
    }

    this.ordersService.getOrderDetails(order.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (details) => {
          this.selectedOrder = this.isOrderDetails(details) ? details : null;
          this.isSelectedOrderLoading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.isSelectedOrderLoading = false;
          this.cdr.markForCheck();
        }
      });
  }



  onImageError(e: Event): void {
    const img = e.target as HTMLImageElement;
    if (!img || img.dataset['failed']) return;
    img.dataset['failed'] = 'true';
    img.src = this.imageFallback;
  }

  goBackToStudents(): void { this.router.navigate(['../..'], { relativeTo: this.route }); }
  trackById(_: number, item: any): string { return item.id; }

  // --- Private Helpers ---
  private handleError() {
    this.isLoading = false;
    this.hasError = true;
    this.cdr.markForCheck();
    return EMPTY;
  }

  private resolveStudentOrders(orders: IOrder[], student: IStudent): IOrder[] {
    const sName = (student.name || '').trim().toLowerCase();
    const sPhone = (student.phone || '').replace(/\D/g, '');

    return orders.filter(o =>
      String(o.studentId) === String(student.id) ||
      (o.customerName || '').trim().toLowerCase() === sName ||
      (this.isOrderDetails(o) && (o.customer.phone || '').replace(/\D/g, '') === sPhone)
    );
  }

  private isOrderDetails(order: any): order is IOrderDetails {
    return Array.isArray(order?.items) && typeof order?.discount === 'number' && !!order?.customer;
  }
}