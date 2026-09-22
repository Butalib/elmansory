import { Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounce, distinctUntilChanged, map, Subject, takeUntil, timer } from 'rxjs';
import { LoadingService } from '../../../../core/service/loading.service';

@Component({
  selector: 'app-inner-action-header',
  standalone: false,
  templateUrl: './inner-action-header.html',
  styleUrl: './inner-action-header.scss',
})
export class InnerActionHeader implements OnInit, OnChanges, OnDestroy {
  private readonly loadingService = inject(LoadingService);


  @Input() showSearch: boolean = true;
  @Input() showActionButton: boolean = false;
  @Input() showFilterButton: boolean = false;
  @Input() showDate: boolean = false;
  @Input() actionLabel: string = '';
  @Input() actionIcon: string = 'fa-solid fa-plus';
  @Input() dateLabel: string = 'من - إلى';
  @Input() searchPlaceholder: string = 'ابحث هنا...';
  @Input() btnIcon: string = '';
  @Input() searchResetKey: string | number = '';


  @Output() search = new EventEmitter<string>();
  @Output() actionClicked = new EventEmitter<void>();


  @Output() sortChange = new EventEmitter<'asc' | 'desc'>();
  @Output() dateRangeChange = new EventEmitter<{ startDate: string; endDate: string }>();


  isFilterMenuOpen = false;
  isDateMenuOpen = false;
  activeSortDirection: 'asc' | 'desc' = 'desc';


  startDateControl = new FormControl('');
  endDateControl = new FormControl('');

  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchResetKey'] && !changes['searchResetKey'].firstChange) {
      this.searchControl.setValue('', { emitEvent: false });
    }
  }


  @HostListener('document:click')
  closeDropdowns(): void {
    this.isFilterMenuOpen = false;
    this.isDateMenuOpen = false;
  }


  toggleFilterMenu(event: Event): void {
    event.stopPropagation();
    this.isFilterMenuOpen = !this.isFilterMenuOpen;
    this.isDateMenuOpen = false;
  }

  toggleDateMenu(event: Event): void {
    event.stopPropagation();
    this.isDateMenuOpen = !this.isDateMenuOpen;
    this.isFilterMenuOpen = false;
  }


  applySort(direction: 'asc' | 'desc'): void {
    this.activeSortDirection = direction;
    this.loadingService.flashPageLoading();
    this.sortChange.emit(direction);
    this.isFilterMenuOpen = false;
  }


  applyDateRange(): void {
    if (this.isDateRangeValid) {
      this.loadingService.flashPageLoading();

      this.dateRangeChange.emit({
        startDate: this.startDateControl.value!,
        endDate: this.endDateControl.value!
      });
      this.dateLabel = `${this.startDateControl.value} إلى ${this.endDateControl.value}`;
      this.isDateMenuOpen = false;
    }
  }
  resetDateRange(): void {
    this.startDateControl.reset();
    this.endDateControl.reset();
    this.dateLabel = 'من - إلى';

    this.loadingService.flashPageLoading();
    this.dateRangeChange.emit({ startDate: '', endDate: '' });
    this.isDateMenuOpen = false;
  }

  onActionClicked() {
    this.actionClicked.emit();
  }

  get hasSearchValue(): boolean {
    return Boolean(this.searchControl.value);
  }

  clearSearch(event: MouseEvent): void {
    event.stopPropagation();

    if (!this.searchControl.value) return;

    this.searchControl.setValue('', { emitEvent: false });
    this.loadingService.flashPageLoading();
    this.search.emit('');
  }

  get isDateRangeValid(): boolean {
    const start = this.startDateControl.value;
    const end = this.endDateControl.value;

    if (!start || !end) return false;

    return new Date(start) <= new Date(end);
  }

  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      debounce((value: string | null) => {
        const shouldFireImmediately = value && value.endsWith(' ');
        return shouldFireImmediately ? timer(0) : timer(500);
      }),
      map((value: string | null) => (value ? value.trim() : '')),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.loadingService.flashPageLoading();
      this.search.emit(value);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
