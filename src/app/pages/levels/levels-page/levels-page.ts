import { Component, inject, OnInit } from '@angular/core';
import { ITableColumn } from '../../../core/interface/IGenericTable';
import { ToastrService } from 'ngx-toastr';
import { LevelsService } from '../../../core/service/levels.service';
import { ILevels } from '../../../core/interface/ILevels';
import { HybridQueryEngine } from '../../../core/service/data/hybrid-query-engine.service';
import { filterByDateRange, filterBySearch } from '../../../core/utils/query';

@Component({
  selector: 'app-levels-page',
  standalone: false,
  templateUrl: './levels-page.html',
  styleUrl: './levels-page.scss',
})
export class LevelsPage implements OnInit {
  private toaster = inject(ToastrService);
  private levelsService = inject(LevelsService);


  tableColumns: ITableColumn[] = [
    { key: 'level', label: 'المرحلة الدراسية', type: 'text' },
    { key: 'subLevel', label: 'الصف الدراسي', type: 'text' },
    { key: 'isActive', label: 'اجراء', type: 'toggle' },
  ];


  readonly engine = new HybridQueryEngine<ILevels>(
    (query) => this.levelsService.loadByQuery(query),
    (data, query) => this.filterLocally(data, query),
    this.levelsService.items$,
    'local'
  );

  ngOnInit(): void {

    this.levelsService.loadAll().subscribe();
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


  private filterLocally(data: ILevels[], query: { searchTerm?: string; startDate?: string; endDate?: string }): ILevels[] {
    const searchResult = filterBySearch(data, query.searchTerm, ['level', 'subLevel']);

    return filterByDateRange(searchResult, query, 'createdAt');
  }

  onPageChange(newPage: number): void {


    this.engine.patchQuery({ _page: newPage });
  }

  onToggleChange(event: { key: string; row: ILevels; value: boolean }): void {
    const updatedLevel = { ...event.row, [event.key]: event.value };


    this.levelsService.update(event.row.id, updatedLevel).subscribe({
      next: () => {
        const status = event.value ? 'تفعيل' : 'إيقاف';
        this.toaster.success(`تم ${status} الصف الدراسي بنجاح`);


      },
      error: (err) => {
        console.error('Error updating level status', err);
        this.toaster.error('حدث خطأ أثناء تعديل الحالة');

        this.levelsService.loadAll().subscribe();
      }
    });
  }
}
