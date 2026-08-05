import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

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
    // 2. تطبيق الـ Debounce
    this.searchControl.valueChanges.pipe(
      debounceTime(500), // استنى نص ثانية بعد آخر حرف
      distinctUntilChanged(), // متكررش الريكوست لنفس الكلمة
      takeUntil(this.destroy$) // لمنع تسريب الذاكرة (Memory Leak)
    ).subscribe(value => {
      this.search.emit(value || '');
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
