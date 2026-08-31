import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ITableColumn } from '../../../../../core/interface/IGenericTable';
import { IQueryEngine } from '../../../../../core/interface/IQueryEngine';
import { IStationery } from '../../../../../core/interface/IStationery';
import { HybridQueryEngine } from '../../../../../core/service/data/hybrid-query-engine.service';
import { StationeryService } from '../../../../../core/service/stationery.service';

@Component({
  selector: 'app-stationery-page',
  standalone: false,
  templateUrl: './stationery-page.html',
  styleUrl: './stationery-page.scss',
})
export class StationeryPage implements OnInit, OnDestroy {
  private readonly stationeryService = inject(StationeryService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toastr = inject(ToastrService);

  isDeleteConfirmOpen = false;
  isDeleting = false;
  productToDelete: IStationery | null = null;

  readonly tableColumns: ITableColumn[] = [
    { key: 'name', label: 'اسم المنتج', type: 'user', imageKey: 'imageUrl' },
    { key: 'originalPrice', label: 'السعر الأصلي', type: 'text' },
    { key: 'consumerPrice', label: 'السعر للمستهلك', type: 'text' },
    {
      key: 'status',
      label: 'الحالة',
      type: 'badge',
      badgeConfig: {
        available: { text: 'متوفر', bgColor: 'var(--color-success-50)', textColor: 'var(--color-success)' },
        unavailable: { text: 'غير متوفر', bgColor: 'var(--color-error-100)', textColor: 'var(--color-error-500)' },
        lowStock: { text: 'قليل في المخزون', bgColor: 'var(--color-warning-100)', textColor: 'var(--color-secondary-500)' },
      },
    },
    { key: 'quantity', label: 'الكمية', type: 'text' },
    {
      key: 'actions',
      label: 'الإجراء',
      type: 'actions',
      hasToggle: true,
      toggleKey: 'isActive',
      actions: [
        { id: 'view', label: 'تفاصيل', icon: 'assets/icon/shared/eye.svg' },
        { id: 'edit', label: 'تعديل', icon: 'assets/icon/shared/edit.svg' },
        { id: 'delete', label: 'حذف', icon: 'assets/icon/shared/delete-02.svg', color: 'var(--color-error-600)' },
      ],
    },
  ];

  readonly engine = new HybridQueryEngine<IStationery>(
    (query: IQueryEngine) => this.stationeryService.loadByQuery(query),
    (data: IStationery[], query: IQueryEngine) => this.filterLocally(data, query),
    this.stationeryService.items$,
    'local',
  );

  ngOnInit(): void {
    this.engine.patchQuery({ _sort: 'createdAt', _order: 'desc' });
    this.stationeryService.loadAll().subscribe();
  }

  openAddView(): void {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  onActionClick(event: { actionId: string; row: IStationery }): void {
    if (event.actionId === 'view') {
      this.router.navigate(['details', event.row.id], { relativeTo: this.route });
      return;
    }

    if (event.actionId === 'edit') {
      this.router.navigate(['edit', event.row.id], { relativeTo: this.route });
      return;
    }

    if (event.actionId === 'delete') {
      this.productToDelete = event.row;
      this.isDeleteConfirmOpen = true;
    }
  }

  confirmDelete(): void {
    if (!this.productToDelete) {
      return;
    }

    this.isDeleting = true;
    this.stationeryService.delete(this.productToDelete.id).subscribe({
      next: () => {
        this.toastr.success('تم حذف المنتج بنجاح');
        this.closeDeleteConfirm();
      },
      error: () => {
        this.isDeleting = false;
        this.toastr.error('حدث خطأ أثناء حذف المنتج');
      },
    });
  }

  closeDeleteConfirm(): void {
    this.isDeleteConfirmOpen = false;
    this.isDeleting = false;
    this.productToDelete = null;
  }

  onToggleStatus(event: { key: string; row: IStationery; value: boolean }): void {
    this.stationeryService.update(event.row.id, { [event.key]: event.value }).subscribe({
      next: () => this.toastr.success('تم تحديث حالة المنتج بنجاح'),
      error: () => this.toastr.error('حدث خطأ أثناء تحديث الحالة'),
    });
  }

  onSearch(searchTerm: string): void {
    this.engine.patchQuery({ searchTerm });
  }

  onSortChange(order: 'asc' | 'desc'): void {
    this.engine.patchQuery({ _sort: 'createdAt', _order: order });
  }

  onDateRangeChange(range: { startDate: string; endDate: string }): void {
    this.engine.patchQuery({ startDate: range.startDate, endDate: range.endDate });
  }

  onPageChange(page: number): void {
    this.engine.patchQuery({ _page: page });
  }

  private filterLocally(data: IStationery[], query: IQueryEngine): IStationery[] {
    let filteredData = [...data];

    if (query.searchTerm) {
      const term = query.searchTerm.toLowerCase();
      filteredData = filteredData.filter((item) =>
        [
          item.name,
          item.originalPrice?.toString(),
          item.consumerPrice?.toString(),
          item.quantity?.toString(),
        ].some((value) => value?.toLowerCase().includes(term)),
      );
    }

    if (query['startDate'] && query['endDate']) {
      filteredData = filteredData.filter((item) => {
        const itemDate =
          typeof item.createdAt === 'string'
            ? item.createdAt.split('T')[0]
            : item.createdAt.toISOString().split('T')[0];

        return itemDate >= query['startDate'] && itemDate <= query['endDate'];
      });
    }

    return filteredData;
  }

  ngOnDestroy(): void {
    this.engine.destroy();
  }
}
