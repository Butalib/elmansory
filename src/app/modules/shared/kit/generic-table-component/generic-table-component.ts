import { Component, EventEmitter, HostListener, Input, Output, computed, inject } from '@angular/core';
import { ITableColumn } from '../../../../core/interface/IGenericTable';
import { LoadingService } from '../../../../core/service/loading.service';

@Component({
  selector: 'app-generic-table',
  standalone: false,
  templateUrl: './generic-table-component.html',
  styleUrl: './generic-table-component.scss',
})
export class GenericTableComponent {
  private readonly loadingService = inject(LoadingService);
  readonly isTableLoading = computed(() => this.loadingService.isPageLoading());
  readonly tableSkeletonRows = Array.from({ length: 5 });

  //table inputs
  @Input() columns: ITableColumn[] = [];
  @Input() data: any[] | null = [];
  //pagination inputs
  @Input() currentPage = 1;
  @Input() totalPages = 1;

  @Output() actionClick = new EventEmitter<{ actionId: string; row: any }>();
  @Output() toggleChange = new EventEmitter<{ key: string; row: any; value: boolean }>();
  @Output() pageChange = new EventEmitter<number>();

  activeDropdownIndex: number | null = null;
  dropdownPosition: 'top' | 'bottom' = 'bottom';

  get skeletonGridColumns(): string {
    return `repeat(${Math.max(this.columns.length, 1)}, minmax(6rem, 1fr))`;
  }

  @HostListener('document:click')
  closeDropdowns(): void {
    this.activeDropdownIndex = null;
  }

  toggleActionMenu(index: number, event: MouseEvent): void {
    event.stopPropagation();

    if (this.activeDropdownIndex === index) {
      this.activeDropdownIndex = null;
      return;
    }

    const trigger = event.currentTarget as HTMLElement;
    const rect = trigger.getBoundingClientRect();

    const estimatedDropdownHeight = 120;
    const spaceBelow = window.innerHeight - rect.bottom;

    this.dropdownPosition =
      spaceBelow < estimatedDropdownHeight
        ? 'top'
        : 'bottom';

    this.activeDropdownIndex = index;
  }

  onActionClick(actionId: string, row: any): void {
    this.actionClick.emit({ actionId, row });
    this.activeDropdownIndex = null;
  }

  onToggle(key: string, row: any, value: boolean): void {
    // const value = (event.target as HTMLInputElement).checked;
    this.toggleChange.emit({ key, row, value });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadingService.flashPageLoading();
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.loadingService.flashPageLoading();
      this.pageChange.emit(this.currentPage - 1);
    }
  }
}
