import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild, } from '@angular/core';
import { ConnectedPosition } from '@angular/cdk/overlay';
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

  @Input() control?: AbstractControl | null = null;

  @Input() value: string | number | null = null;
  @Output() valueChange = new EventEmitter<string | number>();

  @Input() placeholder = 'اختر...';
  @Input() icon = '';
  @Input() options: ISelectOption[] = [];
  @Input() isDisabled = false;

  isOpen = false;
  searchTerm = '';
  searchControl = new FormControl('');
  triggerWidth = 0;
  readonly panelPositions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 4,
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: -4,
    },
  ];

  @ViewChild('triggerElement')
  triggerElement?: ElementRef<HTMLElement>;

  private searchSubscription?: Subscription;
  constructor(private readonly elementRef: ElementRef) { }

  ngOnInit(): void {
    this.searchSubscription = this.searchControl.valueChanges.subscribe((value) => {
      this.searchTerm = value || '';
    });
  }
  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

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

  toggle(): void {
    if (this.currentDisabledState) {
      return;
    }
    this.updateTriggerWidth();
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.resetSearch();
    }
  }
  selectOption(option: ISelectOption): void {

    if (this.control) {
      this.control.setValue(option.id);
      this.control.markAsTouched();
    } else {
      this.valueChange.emit(option.id);
    }
    this.isOpen = false;
    this.resetSearch();
  }
  close(): void {
    if (this.isOpen) {
      this.isOpen = false;
      this.resetSearch();
    }
  }

  private resetSearch(): void {
    this.searchControl.setValue('', { emitEvent: false });
    this.searchTerm = '';
  }
  private updateTriggerWidth(): void {
    this.triggerWidth = this.triggerElement?.nativeElement.getBoundingClientRect().width ?? 0;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }
}
