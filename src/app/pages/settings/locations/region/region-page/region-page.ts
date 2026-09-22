import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { map, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ISelectOption } from '../../../../../core/interface/ISelectOption';
import { ITableColumn } from '../../../../../core/interface/IGenericTable';
import { IGovernorate } from '../../../../../core/interface/IGovernorate';
import { IRegion } from '../../../../../core/interface/IRegion';
import { HeaderStateService } from '../../../../../core/service/header-state.service';
import { GovernorateService } from '../../../../../core/service/Governorate.service';
import { RegionService } from '../../../../../core/service/region.service';
import { HybridQueryEngine } from '../../../../../core/service/data/hybrid-query-engine.service';

interface RegionTableRow extends IRegion {
  deliveryPriceLabel: string;
}

@Component({
  selector: 'app-region-page',
  standalone: false,
  templateUrl: './region-page.html',
  styleUrl: './region-page.scss',
})
export class RegionPage implements OnInit, OnDestroy {
  private readonly headerState = inject(HeaderStateService);
  private readonly governorateService = inject(GovernorateService);
  private readonly regionService = inject(RegionService);
  private readonly toaster = inject(ToastrService);
  private readonly subscriptions = new Subscription();

  readonly tableColumns: ITableColumn[] = [
    { key: 'governorateName', label: 'المحافظة', type: 'text' },
    { key: 'name', label: 'اسم المنطقة', type: 'text' },
    { key: 'addedAt', label: 'تاريخ الإضافة', type: 'date' },
    { key: 'deliveryPriceLabel', label: 'سعر التوصيل', type: 'text' },
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

  readonly engine = new HybridQueryEngine<IRegion>(
    (query) => this.regionService.loadByQuery(query),
    (data, query) => this.filterLocally(data, query),
    this.regionService.items$,
    'local',
  );

  readonly tableRows$ = this.engine.result$.pipe(
    map((regions) => regions.map((region) => this.toTableRow(region))),
  );

  governorateOptions: ISelectOption[] = [];
  governorates: IGovernorate[] = [];
  isModalOpen = false;
  modalMode: 'add' | 'edit' = 'add';
  selectedRegion: IRegion | null = null;
  isConfirmOpen = false;
  isDeleting = false;
  regionIdToDelete: string | null = null;

  ngOnInit(): void {
    this.subscriptions.add(this.headerState.action$.subscribe(() => this.openModal('add')));
    this.subscriptions.add(this.headerState.search$.subscribe((term) => this.onSearch(term)));
    this.subscriptions.add(this.headerState.sort$.subscribe((direction) => this.onSortChange(direction)));
    this.subscriptions.add(this.headerState.dateRange$.subscribe((range) => this.onDateRangeChange(range)));

    this.regionService.loadAll().subscribe();
    this.governorateService.loadAll().subscribe({
      next: (governorates) => {
        this.governorates = governorates;
        this.governorateOptions = governorates.map((governorate) => ({
          id: governorate.id,
          option: governorate.name,
        }));
      },
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.engine.destroy();
  }

  openModal(mode: 'add' | 'edit', region?: IRegion): void {
    this.modalMode = mode;
    this.selectedRegion = region ?? null;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedRegion = null;
  }

  saveRegion(payload: Partial<IRegion>): void {
    if (this.modalMode === 'add') {
      this.regionService.add(payload as IRegion).subscribe({
        next: () => {
          this.toaster.success('تمت إضافة المنطقة بنجاح');
          this.closeModal();
        },
        error: () => this.toaster.error('حدث خطأ أثناء إضافة المنطقة'),
      });
      return;
    }

    if (!payload.id) {
      return;
    }

    this.regionService.update(payload.id, payload).subscribe({
      next: () => {
        this.toaster.success('تم تعديل المنطقة بنجاح');
        this.closeModal();
      },
      error: () => this.toaster.error('حدث خطأ أثناء تعديل المنطقة'),
    });
  }

  onTableActionClick(event: { actionId: string; row: IRegion }): void {
    if (event.actionId === 'edit') {
      this.openModal('edit', event.row);
      return;
    }

    if (event.actionId === 'delete') {
      this.regionIdToDelete = event.row.id;
      this.isConfirmOpen = true;
    }
  }

  confirmDelete(): void {
    if (!this.regionIdToDelete) {
      return;
    }

    this.isDeleting = true;
    this.regionService.delete(this.regionIdToDelete).subscribe({
      next: () => {
        this.toaster.success('تم حذف المنطقة بنجاح');
        this.closeConfirm();
      },
      error: () => {
        this.toaster.error('حدث خطأ أثناء حذف المنطقة');
        this.isDeleting = false;
      },
    });
  }

  closeConfirm(): void {
    this.isConfirmOpen = false;
    this.isDeleting = false;
    this.regionIdToDelete = null;
  }

  onToggleChange(event: { key: string; row: IRegion; value: boolean }): void {
    this.regionService.update(event.row.id, { isActive: event.value }).subscribe({
      next: () => this.toaster.info('تم تغيير حالة المنطقة'),
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

  private filterLocally(data: IRegion[], query: any): IRegion[] {
    let filteredData = data;

    if (query.searchTerm) {
      const term = query.searchTerm.toLowerCase();
      filteredData = filteredData.filter((region) => region.name.toLowerCase().includes(term));
    }

    if (query.startDate && query.endDate) {
      filteredData = filteredData.filter((region) => {
        const addedDate = region.addedAt.split('T')[0];
        return addedDate >= query.startDate && addedDate <= query.endDate;
      });
    }

    return filteredData;
  }

  private toTableRow(region: IRegion): RegionTableRow {
    return {
      ...region,
      deliveryPriceLabel: `${region.deliveryPrice} د.ع`,
    };
  }
}
