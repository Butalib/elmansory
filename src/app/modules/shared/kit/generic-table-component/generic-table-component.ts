import { ConnectedPosition } from '@angular/cdk/overlay';
import { Component, EventEmitter, Input, Output, computed, inject } from '@angular/core';
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

  @Input() columns: ITableColumn[] = [];
  @Input() data: any[] | null = [];

  @Input() currentPage = 1;
  @Input() totalPages = 1;

  @Output() actionClick = new EventEmitter<{ actionId: string; row: any }>();
  @Output() toggleChange = new EventEmitter<{ key: string; row: any; value: boolean }>();
  @Output() pageChange = new EventEmitter<number>();

  activeDropdownIndex: number | null = null;
  readonly dropdownPositions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 4,
    },
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetY: 4,
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: -4,
    },
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetY: -4,
    },
  ];

  get skeletonGridColumns(): string {
    return `repeat(${Math.max(this.columns.length, 1)}, minmax(6rem, 1fr))`;
  }

  toggleActionMenu(index: number, event: Event): void {
    event.stopPropagation();
    this.activeDropdownIndex = this.activeDropdownIndex === index ? null : index;
  }

  closeDropdown(): void {
    this.activeDropdownIndex = null;
  }

  onActionClick(actionId: string, row: any): void {
    this.actionClick.emit({ actionId, row });
    this.activeDropdownIndex = null;
  }

  onToggle(key: string, row: any, value: boolean): void {
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
