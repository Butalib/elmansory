import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, } from '@angular/core';
import { FormControl, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ISelectOption } from '../../../../../core/interface/ISelectOption';

@Component({
  selector: 'app-ui-popup-select',
  standalone: false,
  templateUrl: './ui-popup-select.html',
  styleUrl: './ui-popup-select.scss',
})
export class UiPopupSelect implements OnInit, OnDestroy {
  // Configuration (Hybrid Inputs)
  // 1. Reactive Forms Approach
  @Input() control?: AbstractControl | null = null;
  // 2. Simple Binding Approach
  @Input() value: string | number | null = null;
  @Output() valueChange = new EventEmitter<string | number>();
  // UI Props
  @Input() placeholder = 'اختر...';
  @Input() icon = '';
  @Input() options: ISelectOption[] = [];
  @Input() isDisabled = false;
  // Local UI State
  isOpen = false;
  searchTerm = '';
  searchControl = new FormControl('');
  private searchSubscription?: Subscription;
  constructor(private readonly elementRef: ElementRef) { }
  // Lifecycle
  ngOnInit(): void {
    // مراقبة التغييرات في حقل البحث الداخلي
    this.searchSubscription = this.searchControl.valueChanges.subscribe((value) => {
      this.searchTerm = value || '';
    });
  }
  ngOnDestroy(): void {
    // تنظيف الذاكرة
    this.searchSubscription?.unsubscribe();
  }
  // Derived State (Getters)
  get currentValue(): any {
    return this.control ? this.control.value : this.value;
  }
  get currentDisabledState(): boolean {
    return this.control ? this.control.disabled : this.isDisabled;
  }
  get selectedText(): string {
    const selected = this.options.find((option) => option.id === this.currentValue);
    return selected?.option ?? '';
  }
  get filteredOptions(): ISelectOption[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.options;
    }
    return this.options.filter((option) =>
      option.option.toLowerCase().includes(term)
    );
  }
  // Actions
  toggle(): void {
    if (this.currentDisabledState) {
      return;
    }
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.resetSearch();
    }
  }
  selectOption(option: ISelectOption): void {
    // Hybrid Emit Logic
    if (this.control) {
      this.control.setValue(option.id);
      this.control.markAsTouched();
    } else {
      this.valueChange.emit(option.id);
    }
    this.isOpen = false;
    this.resetSearch();
  }
  private resetSearch(): void {
    // تصفير الكنترول برمجياً بدون إطلاق حدث جديد يستهلك موارد
    this.searchControl.setValue('', { emitEvent: false });
    this.searchTerm = '';
  }
  // Events
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      if (this.isOpen) {
        this.isOpen = false;
        this.resetSearch();
      }
    }
  }
}