import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ITableColumn } from '../../../../../core/interface/IGenericTable';
import { IQueryEngine } from '../../../../../core/interface/IQueryEngine';
import { INotebook } from '../../../../../core/interface/INotebook';
import { HybridQueryEngine } from '../../../../../core/service/data/hybrid-query-engine.service';
import { NotebooksService } from '../../../../../core/service/notebooks.service';

@Component({
  selector: 'app-notebooks-page',
  standalone: false,
  templateUrl: './notebooks-page.html',
  styleUrl: './notebooks-page.scss',
})
export class NotebooksPage implements OnInit, OnDestroy {
  private readonly notebooksService = inject(NotebooksService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toastr = inject(ToastrService);

  isDeleteConfirmOpen = false;
  isDeleting = false;
  notebookToDelete: INotebook | null = null;

  readonly tableColumns: ITableColumn[] = [
    { key: 'name', label: 'اسم المنتج', type: 'user', imageKey: 'imageUrl' },
    { key: 'levelName', label: 'الفصل الدراسي', type: 'text' },
    { key: 'subjectName', label: 'المادة', type: 'text' },
    { key: 'price', label: 'السعر', type: 'text' },
    { key: 'teacherName', label: 'اسم المعلم', type: 'text' },
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
        { id: 'edit', label: 'تعديل', icon: 'assets/icon/shared/edit.svg' },
        { id: 'delete', label: 'حذف', icon: 'assets/icon/shared/delete-02.svg', color: 'var(--color-error-600)' },
      ],
    },
  ];

  readonly engine = new HybridQueryEngine<INotebook>(
    (query: IQueryEngine) => this.notebooksService.loadByQuery(query),
    (data: INotebook[], query: IQueryEngine) => this.filterLocally(data, query),
    this.notebooksService.items$,
    'local',
  );

  ngOnInit(): void {
    this.engine.patchQuery({ _sort: 'createdAt', _order: 'desc' });
    this.notebooksService.loadAll().subscribe();
  }

  openAddView(): void {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  onActionClick(event: { actionId: string; row: INotebook }): void {
    if (event.actionId === 'edit') {
      this.router.navigate(['edit', event.row.id], { relativeTo: this.route });
      return;
    }

    if (event.actionId === 'delete') {
      this.notebookToDelete = event.row;
      this.isDeleteConfirmOpen = true;
    }
  }

  confirmDelete(): void {
    if (!this.notebookToDelete) {
      return;
    }

    this.isDeleting = true;
    this.notebooksService.delete(this.notebookToDelete.id).subscribe({
      next: () => {
        this.toastr.success('تم حذف الملزمة بنجاح');
        this.closeDeleteConfirm();
      },
      error: () => {
        this.isDeleting = false;
        this.toastr.error('حدث خطأ أثناء حذف الملزمة');
      },
    });
  }

  closeDeleteConfirm(): void {
    this.isDeleteConfirmOpen = false;
    this.isDeleting = false;
    this.notebookToDelete = null;
  }

  onToggleStatus(event: { key: string; row: INotebook; value: boolean }): void {
    this.notebooksService.update(event.row.id, { [event.key]: event.value }).subscribe({
      next: () => this.toastr.success('تم تحديث حالة الملزمة بنجاح'),
      error: () => this.toastr.error('حدث خطأ أثناء تحديث الحالة'),
    });
  }

  onSearch(searchTerm: string): void {
    this.engine.patchQuery({ searchTerm });
  }

  onSortChange(order: 'asc' | 'desc'): void {
    this.engine.patchQuery({ _sort: 'createdAt', _order: order });
  }

  onPageChange(page: number): void {
    this.engine.patchQuery({ _page: page });
  }

  private filterLocally(data: INotebook[], query: IQueryEngine): INotebook[] {
    let filteredData = [...data];

    if (query.searchTerm) {
      const term = query.searchTerm.toLowerCase();
      filteredData = filteredData.filter((item) =>
        [
          item.name,
          item.teacherName,
          item.subjectName,
          item.levelName,
          item.price?.toString(),
          item.quantity?.toString(),
        ].some((value) => value?.toLowerCase().includes(term)),
      );
    }

    return filteredData;
  }

  ngOnDestroy(): void {
    this.engine.destroy();
  }
}
