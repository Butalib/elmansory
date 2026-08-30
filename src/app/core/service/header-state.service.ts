import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface HeaderConfig {
  title: string;
  buttonText: string;
  showButton: boolean;
  showSearch: boolean;
  showFilterButton: boolean;
  showDate: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class HeaderStateService {
  //header state management
  private configSource = new BehaviorSubject<HeaderConfig>({
    title: '', buttonText: '', showButton: false, showSearch: true, showFilterButton: false, showDate: false
  });
  config$ = this.configSource.asObservable();

  // state management for actions, search, sort, and date range
  private actionSource = new Subject<void>();
  action$ = this.actionSource.asObservable();

  private searchSource = new Subject<string>();
  search$ = this.searchSource.asObservable();

  private sortSource = new Subject<'asc' | 'desc'>();
  sort$ = this.sortSource.asObservable();

  private dateRangeSource = new Subject<{ startDate: string; endDate: string }>();
  dateRange$ = this.dateRangeSource.asObservable();

  // methods to update the state
  setConfig(config: Partial<HeaderConfig>) {
    this.configSource.next({ ...this.configSource.value, ...config });
  }

  emitAction() { this.actionSource.next(); }
  emitSearch(term: string) { this.searchSource.next(term); }
  emitSort(direction: 'asc' | 'desc') { this.sortSource.next(direction); }
  emitDateRange(range: { startDate: string; endDate: string }) { this.dateRangeSource.next(range); }
}