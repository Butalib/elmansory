import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import { ConnectedPosition } from '@angular/cdk/overlay';

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
  @Input() icon?: string;

  isOpen = false;
  triggerWidth = 0;
  readonly dropdownPositions: ConnectedPosition[] = [
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

  constructor(
    private readonly eRef: ElementRef
  ) { }


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

    return selectedOption?.option ?? '';
  }


  toggleDropdown(event: Event): void {
    event.stopPropagation();

    this.updateTriggerWidth();
    this.isOpen = !this.isOpen;
  }

  selectOption(option: ISelectOption): void {
    this.control.setValue(option.id);
    this.control.markAsTouched();

    this.isOpen = false;
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  private updateTriggerWidth(): void {
    this.triggerWidth = this.triggerElement?.nativeElement.getBoundingClientRect().width ?? 0;
  }


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}
