import {
  Component,
  ElementRef,
  HostListener,
  Input,
} from '@angular/core';

import { FormControl } from '@angular/forms';

import { ISelectOption } from '../../../../../core/interface/ISelectOption';

@Component({
  selector: 'app-ui-select',
  standalone: false,
  templateUrl: './ui-select-component.html',
  styleUrl: './ui-select-component.scss',
})
export class UiSelectComponent {

  @Input({ required: true })
  control!: FormControl;


  @Input()
  placeholder = '';

  @Input()
  options: ISelectOption[] = [];
  // إضافة استقبال مسار الأيقونة (اختياري)
  @Input() icon?: string;

  isOpen = false;

  constructor(
    private readonly eRef: ElementRef
  ) { }

  // =========================
  // Selected Option
  // =========================

  get selectedText(): string {
    const value = this.control.value;

    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return '';
    }

    const selectedOption = this.options.find(
      option => option.id === value
    );

    return selectedOption?.label ?? '';
  }

  // =========================
  // Dropdown
  // =========================

  toggleDropdown(event: Event): void {
    event.stopPropagation();

    this.isOpen = !this.isOpen;
  }

  selectOption(option: ISelectOption): void {
    this.control.setValue(option.id);
    this.control.markAsTouched();

    this.isOpen = false;
  }

  // =========================
  // Outside Click
  // =========================

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}