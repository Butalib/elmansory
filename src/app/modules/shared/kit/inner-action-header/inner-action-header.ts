import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounce, distinctUntilChanged, map, Subject, takeUntil, timer } from 'rxjs';
import { LoadingService } from '../../../../core/service/loading.service';

@Component({
  selector: 'app-inner-action-header',
  standalone: false,
  templateUrl: './inner-action-header.html',
  styleUrl: './inner-action-header.scss',
})
export class InnerActionHeader implements OnInit, OnDestroy {
  private readonly loadingService = inject(LoadingService);

  // ui element render 
  @Input() showSearch: boolean = true;
  @Input() showActionButton: boolean = false;
  @Input() showFilterButton: boolean = false;
  @Input() showDate: boolean = false;
  @Input() actionLabel: string = '';
  @Input() actionIcon: string = 'fa-solid fa-plus';
  @Input() dateLabel: string = 'من - إلى';
  @Input() searchPlaceholder: string = 'ابحث هنا...';
  @Input() btnIcon: string = '';

  // ui event 
  @Output() search = new EventEmitter<string>();
  @Output() actionClicked = new EventEmitter<void>();

  // الـ Outputs الجديدة بتاعة الفلترة
  @Output() sortChange = new EventEmitter<'asc' | 'desc'>();
  @Output() dateRangeChange = new EventEmitter<{ startDate: string; endDate: string }>();

  // UI States للقوايم
  isFilterMenuOpen = false;
  isDateMenuOpen = false;

  // Form Controls لتواريخ البداية والنهاية
  startDateControl = new FormControl('');
  endDateControl = new FormControl('');

  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();

  // قفل القوايم لو اليوزر داس في أي مكان فاضي في الشاشة
  @HostListener('document:click')
  closeDropdowns(): void {
    this.isFilterMenuOpen = false;
    this.isDateMenuOpen = false;
  }

  // دوال التحكم في القوايم
  toggleFilterMenu(event: Event): void {
    event.stopPropagation(); // عشان الـ HostListener ميقفلهاش فوراً
    this.isFilterMenuOpen = !this.isFilterMenuOpen;
    this.isDateMenuOpen = false; // نقفل التانية لو مفتوحة
  }

  toggleDateMenu(event: Event): void {
    event.stopPropagation();
    this.isDateMenuOpen = !this.isDateMenuOpen;
    this.isFilterMenuOpen = false;
  }

  // تطبيق الترتيب
  applySort(direction: 'asc' | 'desc'): void {
    this.loadingService.flashPageLoading();
    this.sortChange.emit(direction);
    this.isFilterMenuOpen = false; // نقفل القايمة بعد الاختيار
  }

  // تطبيق نطاق التاريخ
  applyDateRange(): void {
    if (this.isDateRangeValid) {
      this.loadingService.flashPageLoading();
      // الـ ! هنا لأننا اتأكدنا في الـ Valid إنهم مش null
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
    this.dateLabel = 'من - إلى'; // نرجع الكلمة الافتراضية

    this.loadingService.flashPageLoading();
    this.dateRangeChange.emit({ startDate: '', endDate: '' });
    this.isDateMenuOpen = false;
  }

  onActionClicked() {
    this.actionClicked.emit();
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
