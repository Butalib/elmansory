import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ITableColumn } from '../../../core/interface/IGenericTable';

@Component({
  selector: 'app-generic-table',
  standalone: false,
  templateUrl: './generic-table-component.html',
  styleUrl: './generic-table-component.scss',
})
export class GenericTableComponent {
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

  @HostListener('document:click')
  closeDropdowns(): void {
    this.activeDropdownIndex = null;
  }

  toggleActionMenu(index: number, event: Event): void {
    event.stopPropagation();
    this.activeDropdownIndex = this.activeDropdownIndex === index ? null : index;
  }

  onActionClick(actionId: string, row: any): void {
    this.actionClick.emit({ actionId, row });
    this.activeDropdownIndex = null;
  }

  onToggle(key: string, row: any, event: Event): void {
    const value = (event.target as HTMLInputElement).checked;
    this.toggleChange.emit({ key, row, value });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
      console.log(this.currentPage + 1);

    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
      console.log(this.currentPage - 1);
    }
  }
}
