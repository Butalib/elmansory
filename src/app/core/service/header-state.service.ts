import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface IHeaderConfig {
  title: string;
  buttonText: string;
  btnIcon: string;
  showButton: boolean;
  showSearch: boolean;
  showFilterButton: boolean;
  showDate: boolean;
}

const DEFAULT_HEADER_CONFIG: IHeaderConfig = {
  title: '',
  buttonText: '',
  btnIcon: '',
  showButton: false,
  showSearch: true,
  showFilterButton: false,
  showDate: false,
};

@Injectable({
  providedIn: 'root',
})
export class HeaderStateService {

  private configSource = new BehaviorSubject<IHeaderConfig>(DEFAULT_HEADER_CONFIG);
  config$ = this.configSource.asObservable();


  private actionSource = new Subject<void>();
  action$ = this.actionSource.asObservable();

  private searchSource = new Subject<string>();
  search$ = this.searchSource.asObservable();

  private sortSource = new Subject<'asc' | 'desc'>();
  sort$ = this.sortSource.asObservable();

  private dateRangeSource = new Subject<{ startDate: string; endDate: string }>();
  dateRange$ = this.dateRangeSource.asObservable();


  setConfig(config: Partial<IHeaderConfig>) {
    this.configSource.next({ ...DEFAULT_HEADER_CONFIG, ...config });
  }

  emitAction() { this.actionSource.next(); }
  emitSearch(term: string) { this.searchSource.next(term); }
  emitSort(direction: 'asc' | 'desc') { this.sortSource.next(direction); }
  emitDateRange(range: { startDate: string; endDate: string }) { this.dateRangeSource.next(range); }
}
