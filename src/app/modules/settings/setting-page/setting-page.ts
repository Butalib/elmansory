import { Component, inject } from '@angular/core';
import { HeaderStateService } from '../../../core/service/header-state.service';

@Component({
  selector: 'app-setting-page',
  standalone: false,
  templateUrl: './setting-page.html',
  styleUrl: './setting-page.scss',
})
export class SettingPage {
  private headerState = inject(HeaderStateService);
  config$ = this.headerState.config$;
  onActionClicked() {
    this.headerState.emitAction();
  }
  onSearch(term: string) {
    this.headerState.emitSearch(term);
  }
  onSortChange(direction: 'asc' | 'desc') {
    this.headerState.emitSort(direction);
  }
  onDateRangeChange(range: { startDate: string; endDate: string }) {
    this.headerState.emitDateRange(range);
  }
}