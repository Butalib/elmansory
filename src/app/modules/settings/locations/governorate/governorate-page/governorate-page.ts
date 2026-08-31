import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { IGovernorate } from '../../../../../core/interface/IGovernorate';
import { ITableColumn } from '../../../../../core/interface/IGenericTable';
import { HeaderStateService } from '../../../../../core/service/header-state.service';
import { HybridQueryEngine } from '../../../../../core/service/data/hybrid-query-engine.service';
import { GovernorateService } from '../../../../../core/service/Governorate.service';

@Component({
  selector: 'app-governorate-page',
  standalone: false,
  templateUrl: './governorate-page.html',
  styleUrl: './governorate-page.scss',
})
export class GovernoratePage implements OnInit, OnDestroy {
  private readonly headerState = inject(HeaderStateService);
  private readonly governorateService = inject(GovernorateService);
  private readonly toaster = inject(ToastrService);
  private readonly subscriptions = new Subscription();

  readonly tableColumns: ITableColumn[] = [
    { key: 'name', label: 'اسم المحافظة', type: 'text' },
    { key: 'regionsCount', label: 'عدد المناطق', type: 'text' },
    { key: 'addedAt', label: 'تاريخ الإضافة', type: 'date' },
    {
      key: 'actions',
      label: 'إجراء',
      type: 'actions',
      hasToggle: true,
      toggleKey: 'isActive',
      actions: [
        { id: 'edit', label: 'تعديل', icon: 'assets/icon/shared/edit.svg' },
        { id: 'delete', label: 'حذف', icon: 'assets/icon/shared/delete-02.svg', color: 'var(--color-error-500)' },
      ],
    },
  ];

  readonly engine = new HybridQueryEngine<IGovernorate>(
    (query) => this.governorateService.loadByQuery(query),
    (data, query) => this.filterLocally(data, query),
    this.governorateService.items$,
    'local',
  );

  isModalOpen = false;
  modalMode: 'add' | 'edit' = 'add';
  selectedGovernorate: IGovernorate | null = null;
  isConfirmOpen = false;
  isDeleting = false;
  governorateIdToDelete: string | null = null;

  ngOnInit(): void {
    this.subscriptions.add(this.headerState.action$.subscribe(() => this.openModal('add')));
    this.subscriptions.add(this.headerState.search$.subscribe((term) => this.onSearch(term)));
    this.subscriptions.add(this.headerState.sort$.subscribe((direction) => this.onSortChange(direction)));
    this.subscriptions.add(this.headerState.dateRange$.subscribe((range) => this.onDateRangeChange(range)));

    this.governorateService.loadAll().subscribe();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.engine.destroy();
  }

  openModal(mode: 'add' | 'edit', governorate?: IGovernorate): void {
    this.modalMode = mode;
    this.selectedGovernorate = governorate ?? null;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedGovernorate = null;
  }

  saveGovernorate(payload: Partial<IGovernorate>): void {
    if (this.modalMode === 'add') {
      this.governorateService.add(payload as IGovernorate).subscribe({
        next: () => {
          this.toaster.success('تمت إضافة المحافظة بنجاح');
          this.closeModal();
        },
        error: () => this.toaster.error('حدث خطأ أثناء إضافة المحافظة'),
      });
      return;
    }

    if (!payload.id) {
      return;
    }

    this.governorateService.update(payload.id, payload).subscribe({
      next: () => {
        this.toaster.success('تم تعديل المحافظة بنجاح');
        this.closeModal();
      },
      error: () => this.toaster.error('حدث خطأ أثناء تعديل المحافظة'),
    });
  }

  onTableActionClick(event: { actionId: string; row: IGovernorate }): void {
    if (event.actionId === 'edit') {
      this.openModal('edit', event.row);
      return;
    }

    if (event.actionId === 'delete') {
      this.governorateIdToDelete = event.row.id;
      this.isConfirmOpen = true;
    }
  }

  confirmDelete(): void {
    if (!this.governorateIdToDelete) {
      return;
    }

    this.isDeleting = true;
    this.governorateService.delete(this.governorateIdToDelete).subscribe({
      next: () => {
        this.toaster.success('تم حذف المحافظة بنجاح');
        this.closeConfirm();
      },
      error: () => {
        this.toaster.error('حدث خطأ أثناء حذف المحافظة');
        this.isDeleting = false;
      },
    });
  }

  closeConfirm(): void {
    this.isConfirmOpen = false;
    this.isDeleting = false;
    this.governorateIdToDelete = null;
  }

  onToggleChange(event: { key: string; row: IGovernorate; value: boolean }): void {
    this.governorateService.update(event.row.id, { isActive: event.value }).subscribe({
      next: () => this.toaster.info('تم تغيير حالة المحافظة'),
      error: () => this.toaster.error('حدث خطأ أثناء تغيير الحالة'),
    });
  }

  onPageChange(page: number): void {
    this.engine.patchQuery({ _page: page });
  }

  private onSearch(searchTerm: string): void {
    this.engine.patchQuery({ searchTerm });
  }

  private onSortChange(direction: 'asc' | 'desc'): void {
    this.engine.patchQuery({ _sort: 'addedAt', _order: direction });
  }

  private onDateRangeChange(range: { startDate: string; endDate: string }): void {
    this.engine.patchQuery({ startDate: range.startDate, endDate: range.endDate });
  }

  private filterLocally(data: IGovernorate[], query: any): IGovernorate[] {
    let filteredData = data;

    if (query.searchTerm) {
      const term = query.searchTerm.toLowerCase();
      filteredData = filteredData.filter((governorate) => governorate.name.toLowerCase().includes(term));
    }

    if (query.startDate && query.endDate) {
      filteredData = filteredData.filter((governorate) => {
        const addedDate = governorate.addedAt.split('T')[0];
        return addedDate >= query.startDate && addedDate <= query.endDate;
      });
    }

    return filteredData;
  }
}
