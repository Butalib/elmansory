import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounce, distinctUntilChanged, map, Subject, takeUntil, timer } from 'rxjs';

@Component({
  selector: 'app-inner-action-header',
  standalone: false,
  templateUrl: './inner-action-header.html',
  styleUrl: './inner-action-header.scss',
})
export class InnerActionHeader implements OnInit, OnDestroy {
  // ui elment render 
  @Input() showSearch: boolean = true;
  @Input() showActionButton: boolean = false;
  @Input() showFilterButton: boolean = false;
  @Input() showDate: boolean = false;
  @Input() actionLabel: string = '';
  @Input() actionIcon: string = 'fa-solid fa-plus';
  @Input() dateLabel: string = '';
  @Input() searchPlaceholder: string = 'ابحث هنا...';
  @Input() btnIcon: string = '';
  // ui event 
  @Output() search = new EventEmitter<string>();
  @Output() actionClicked = new EventEmitter<void>();
  @Output() filterClicked = new EventEmitter<void>();
  //event handlers
  onActionClicked() {
    this.actionClicked.emit();
  }
  onFilterClicked() {
    this.filterClicked.emit();
  }
  // 1. تعريف الـ FormControl للسيرش
  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();
  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      // 1. تحديد وقت التأخير ديناميكياً
      debounce((value: string | null) => {
        // لو القيمة موجودة وآخر حرف هو مسافة، اضرب فوراً (0)
        // غير كده، استنى 500 ملي ثانية
        const shouldFireImmediately = value && value.endsWith(' ');
        return shouldFireImmediately ? timer(0) : timer(500);
      }),
      // 2. تنظيف الكلمة من المسافات الزايدة
      map((value: string | null) => (value ? value.trim() : '')),
      // 3. منع إرسال نفس الكلمة مرتين متتاليتين
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      console.log('Search value emitted:', value);
      this.search.emit(value);
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
