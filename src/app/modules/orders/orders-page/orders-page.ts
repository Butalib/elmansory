import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HybridQueryEngine } from '../../../core/service/data/hybrid-query-engine.service';
import { ToastrService } from 'ngx-toastr';
import { ITableColumn } from '../../../core/interface/IGenericTable';
import { IOrder } from '../../../core/interface/IOrder';
import { OrdersService } from '../../../core/service/orders.service';
import { IKpi } from '../../../core/interface/IKpi';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-orders-page',
  standalone: false,
  templateUrl: './orders-page.html',
  styleUrl: './orders-page.scss',
})
export class OrdersPage implements OnInit {
  private toaster = inject(ToastrService);
  private readonly ordersService = inject(OrdersService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);


  tableColumns: ITableColumn[] = [
    { key: 'orderCode', label: 'كود الطلب', type: 'text' },
    { key: 'customerName', label: 'اسم العميل', type: 'user', imageKey: 'customerAvatar' },
    { key: 'itemCount', label: 'عدد المنتجات', type: 'text' },
    { key: 'createdAt', label: 'تاريخ الانشاء', type: 'date' },
    {
      key: 'status',
      label: 'الحالة',
      type: 'badge',
      badgeConfig: {
        pending: { text: 'قيد المراجعة', bgColor: 'var(--color-warning-100)', textColor: 'var(--color-secondary-500)' },
        accepted: { text: 'تم القبول', bgColor: 'var(--color-success-100)', textColor: 'var(--color-success-700)' },
        rejected: { text: 'مرفوض', bgColor: 'var(--color-error-100)', textColor: 'var(--color-error-600)' },
      },
    },
    {
      key: 'actions',
      label: 'اجراء',
      type: 'actions',
      hasToggle: true,
      toggleKey: 'isActive',
      actions: [
        { id: 'edit', label: 'تعديل', icon: 'assets/icon/shared/edit.svg', color: '' },
        { id: 'view', label: 'تفاصيل', icon: 'assets/icon/shared/eye.svg', color: '' },
        { id: 'delete', label: 'حذف', icon: 'assets/icon/shared/delete-02.svg', color: 'var(--color-error-600)' },
      ],
    },
  ];


  readonly engine = new HybridQueryEngine<IOrder>(
    (query) => this.ordersService.loadByQuery(query),
    (data, query) => this.filterLocally(data, query),
    this.ordersService.items$,
    'local',
  );

  kpiStats$!: Observable<IKpi[]>;


  isAcceptAllModalOpen = false;


  isSaving = false;


  isDeleteConfirmOpen = false;
  isDeleting = false;
  orderIdToDelete: string | null = null;


  activeOrderType: string = 'الكل';


  ngOnInit(): void {
    this.ordersService.loadAll().subscribe();
    this.kpiStats$ = this.ordersService.items$.pipe(
      map((orders) => {
        const totalOrders = orders.length;
        const pendingOrders = orders.filter((o) => o.status === 'pending').length;
        const acceptedOrders = orders.filter((o) => o.status === 'accepted').length;
        const rejectedOrders = orders.filter((o) => o.status === 'rejected').length;

        return [
          {
            id: 'total',
            title: 'إجمالي الطلبات',
            value: totalOrders,
            icon: 'assets/icon/shared/kpi/total.svg',
          },
          {
            id: 'pending',
            title: 'الطلبات المعلقة',
            value: pendingOrders,
            icon: 'assets/icon/shared/kpi/pending.svg',
          },
          {
            id: 'accepted',
            title: 'الطلبات المقبولة',
            value: acceptedOrders,
            icon: 'assets/icon/shared/kpi/accepted.svg',
          },
          {
            id: 'rejected',
            title: 'الطلبات المرفوضة',
            value: rejectedOrders,
            icon: 'assets/icon/shared/kpi/rejected.svg',
          },
        ];
      }),
    );
  }


  onActionClick(event: { actionId: string; row: any }): void {
    switch (event.actionId) {
      case 'view':
        this.router.navigate(['details', event.row.id], { relativeTo: this.route });
        break;
      case 'edit':
        this.router.navigate(['details', event.row.id], {
          relativeTo: this.route,
          queryParams: { mode: 'edit' },
        });
        break;
      case 'delete':
        this.orderIdToDelete = event.row.id;
        this.isDeleteConfirmOpen = true;
        break;
    }
  }


  onToggleStatus(event: { key: string; row: any; value: boolean }): void {
    const orderId = event.row.id;
    const newValue = event.value;
    const targetProperty = event.key;

    this.ordersService.update(orderId, { [targetProperty]: newValue }).subscribe({
      next: () => {
        this.toaster.success('تم التحديث بنجاح');


        event.row[targetProperty] = newValue;
      },
      error: () => {
        this.toaster.error('حدث خطأ');
        event.row[targetProperty] = !newValue;
      },
    });
  }


  confirmDelete(): void {
    if (!this.orderIdToDelete) return;
    this.isDeleting = true;

    this.ordersService.delete(this.orderIdToDelete).subscribe({
      next: () => {
        this.toaster.success('تم حذف الطلب بنجاح');
        this.closeDeleteConfirm();
      },
      error: () => {
        this.toaster.error('حدث خطأ أثناء الحذف');
        this.isDeleting = false;
      },
    });
  }

  closeDeleteConfirm(): void {
    this.isDeleteConfirmOpen = false;
    this.orderIdToDelete = null;
    this.isDeleting = false;
  }


  onActionClicked(): void {
    this.isAcceptAllModalOpen = true;
  }

  confirmAcceptAll(): void {
    this.isSaving = true;
    setTimeout(() => {
      this.toaster.success('تم اعتماد جميع الطلبات قيد المراجعة بنجاح');
      this.isAcceptAllModalOpen = false;
      this.isSaving = false;
      this.engine.refreshSource();
    }, 1000);
  }


  onPageChange(newPage: number): void {
    this.engine.patchQuery({ _page: newPage });
  }

  onSearch(searchTerm: string): void {
    this.engine.patchQuery({ searchTerm });
  }

  onSortChange(sortDirection: 'asc' | 'desc'): void {
    this.engine.patchQuery({ _sort: 'createdAt', _order: sortDirection });
  }

  onDateRangeChange(range: { startDate: string; endDate: string }): void {
    this.engine.patchQuery({ startDate: range.startDate, endDate: range.endDate });
  }

  onOrderTypeFilterChange(type: string): void {
    this.activeOrderType = type;
    this.engine.patchQuery({ orderType: type });
  }


  private filterLocally(data: IOrder[], query: any): IOrder[] {
    let filteredData = data;

    if (query.orderType && query.orderType !== 'الكل') {
      filteredData = filteredData.filter((order) => order.orderType === query.orderType);
    }

    if (query.searchTerm) {
      const term = query.searchTerm.toLowerCase();
      filteredData = filteredData.filter(
        (order) =>
          order.orderCode?.toLowerCase().includes(term) ||
          order.customerName?.toLowerCase().includes(term) ||
          order.itemCount?.toString().includes(term) ||
          order.status?.toLowerCase().includes(term),
      );
    }

    if (query.startDate && query.endDate) {
      filteredData = filteredData.filter((order) => {
        const orderDate = order.createdAt.split('T')[0];
        return orderDate >= query.startDate && orderDate <= query.endDate;
      });
    }

    return filteredData;
  }
}
