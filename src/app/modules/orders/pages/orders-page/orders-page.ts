import { Component, inject, OnInit } from '@angular/core';
import { HybridQueryEngine } from '../../../../core/service/data/hybrid-query-engine.service';
import { ToastrService } from 'ngx-toastr';
import { ITableColumn } from '../../../../core/interface/IGenericTable';
import { IOrder } from '../../../../core/interface/IOrder';
import { OrdersService } from '../../../../core/service/orders.service';
import { IKpi } from '../../../../core/interface/IKpi';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-orders-page',
  standalone: false,
  templateUrl: './orders-page.html',
  styleUrl: './orders-page.scss',
})
export class OrdersPage implements OnInit {
  private toaster = inject(ToastrService);
  private readonly OrdersService = inject(OrdersService);
  tableColumns: ITableColumn[] = [
    { key: 'orderCode', label: 'كود الطلب', type: 'text' },
    { key: 'customerName', label: 'اسم العميل', type: 'user', imageKey: 'customerAvatar' },
    { key: 'itemCount', label: 'عدد المنتجات', type: 'text' },
    { key: 'createdAt', label: 'تاريخ الانشاء', type: 'date' },
    {
      key: 'status',
      label: 'الحالة',
      type: 'badge', // غيرنا النوع هنا
      badgeConfig: {
        'pending': { text: 'قيد المراجعة', bgColor: '#FEF3C7', textColor: '#D97706' },
        'accepted': { text: 'تم القبول', bgColor: '#D1FAE5', textColor: '#059669' },
        'rejected': { text: 'مرفوض', bgColor: '#FEE2E2', textColor: '#DC2626' }
      }
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
        { id: 'delete', label: 'حذف', icon: 'assets/icon/shared/delete-02.svg', color: '#dc2626' }
      ]
    },
  ];
  readonly engine = new HybridQueryEngine<IOrder>(
    (query) => this.OrdersService.loadByQuery(query),
    (data, query) => this.filterLocally(data, query),
    // 3. Source of Truth
    this.OrdersService.items$,
    // 4. Mode
    'local'
  );
  kpiStats$!: Observable<IKpi[]>;
  ngOnInit(): void {
    this.OrdersService.loadAll().subscribe();
    this.kpiStats$ = this.OrdersService.items$.pipe(
      // تحويل البيانات إلى إحصائيات KPI
      map(orders => {
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(o => o.status === 'pending').length;
        const acceptedOrders = orders.filter(o => o.status === 'accepted').length;
        const rejectedOrders = orders.filter(o => o.status === 'rejected').length;

        return [
          { id: 'total', title: 'إجمالي الطلبات', value: totalOrders, icon: 'assets/icon/shared/kpi/total.svg' },
          { id: 'pending', title: 'الطلبات المعلقة', value: pendingOrders, icon: 'assets/icon/shared/kpi/pending.svg' },
          { id: 'accepted', title: 'الطلبات المقبولة', value: acceptedOrders, icon: 'assets/icon/shared/kpi/accepted.svg' },
          { id: 'rejected', title: 'الطلبات المرفوضة', value: rejectedOrders, icon: 'assets/icon/shared/kpi/rejected.svg' }
        ];
      })
    );

  }
  activeOrderType: string = 'الكل';
  private filterLocally(data: IOrder[], query: any): IOrder[] {
    let filteredData = data;

    // 1. الفلترة حسب نوع الطلب (Custom Feature Filter)
    if (query.orderType && query.orderType !== 'الكل') {
      filteredData = filteredData.filter(order => order.orderType === query.orderType);
    }
    if (query.searchTerm) {
      const term = query.searchTerm.toLowerCase();
      filteredData = filteredData.filter(order =>
        order.orderCode?.toLowerCase().includes(term) ||
        order.customerName?.toLowerCase().includes(term) ||
        order.itemCount?.toString().includes(term) ||
        order.status?.toLowerCase().includes(term)
      );
    }
    if (query.startDate && query.endDate) {
      filteredData = filteredData.filter(order => {
        const orderDate = order.createdAt.split('T')[0];
        return orderDate >= query.startDate && orderDate <= query.endDate;
      });
    }
    if (query.startDate && query.endDate) {
      filteredData = filteredData.filter(order => {
        const orderDate = order.createdAt.split('T')[0];
        return orderDate >= query.startDate && orderDate <= query.endDate;
      });
    }
    return filteredData;
  }
  onDateRangeChange(range: { startDate: string; endDate: string }): void {
    this.engine.patchQuery({ startDate: range.startDate, endDate: range.endDate });
  }
  onOrderTypeFilterChange(type: string): void {
    this.activeOrderType = type;
    this.engine.patchQuery({ orderType: type });
  }
  onSortChange(sortDirection: 'asc' | 'desc'): void {
    this.engine.patchQuery({ _sort: 'createdAt', _order: sortDirection });
  }
  onPageChange(newPage: number): void {
    this.engine.patchQuery({ _page: newPage });
  }
  onSearch(searchTerm: string): void {
    this.engine.patchQuery({ searchTerm });
  }
  onToggleStatus(event: { key: string; row: any; value: boolean }): void {
    const orderId = event.row.id;
    const newValue = event.value;
    const targetProperty = event.key;
    const payload = { [targetProperty]: newValue };
    this.OrdersService.update(orderId, payload).subscribe({
      next: () => {
        this.toaster.success('تم التحديث بنجاح');
        event.row[targetProperty] = newValue;
      },
      error: () => {
        this.toaster.error('حدث خطأ');
        event.row[targetProperty] = !newValue;
      }
    });
  }
  isAcceptAllModalOpen = false;
  isOrderDetailsModalOpen = false;
  selectedOrder: IOrder | null = null;
  isSaving = false; // عشان نقفل الزراير وقت التحميل

  // 1. هندلة زرار "قبول الطلبات المعلقة" اللي في الهيدر
  onActionClicked(): void {
    // الهيدر بعت إيفنت، نفتح بيه مودال التأكيد
    this.isAcceptAllModalOpen = true;
  }

  // تنفيذ قبول الكل بعد ما اليوزر يدوس "تأكيد" في المودال
  confirmAcceptAll(): void {
    this.isSaving = true;

    // افترضنا إن السيرفيس فيها دالة bulkUpdate أو acceptAll
    // this.OrdersService.acceptAll().subscribe(...)
    setTimeout(() => {
      this.toaster.success('تم اعتماد جميع الطلبات قيد المراجعة بنجاح');
      this.isAcceptAllModalOpen = false;
      this.isSaving = false;
      this.engine.refreshSource(); // تحديث الجدول
    }, 1000); // Mock API Call
  }

  // 2. هندلة ضغطة زرار "تفاصيل" (العين) اللي في المنيو بتاعة الجدول
  onActionClick(event: { actionId: string; row: any }): void {
    if (event.actionId === 'view') {
      this.selectedOrder = event.row;
      this.isOrderDetailsModalOpen = true;
    } else if (event.actionId === 'delete') {
      // كود الحذف اللي عملناه قبل كده
    }
  }

  // تنفيذ حفظ التعديلات (الخصم) من مودال التفاصيل
  saveOrderDetails(event: { orderId: string; discount: number }): void {
    this.isSaving = true;

    this.OrdersService.update(event.orderId, { discount: event.discount }).subscribe({
      next: () => {
        this.toaster.success('تم تحديث تفاصيل الطلب بنجاح');
        this.isOrderDetailsModalOpen = false;
        this.isSaving = false;

        // لو حابين نحدث الصف محلياً بدون ريفريش كامل
        if (this.selectedOrder) {
          (this.selectedOrder as any).discount = event.discount;
        }
      },
      error: () => {
        this.toaster.error('حدث خطأ أثناء حفظ التعديلات');
        this.isSaving = false;
      }
    });
  }
}
