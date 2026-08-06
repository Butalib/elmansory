import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ui-modal',
  standalone: false,
  templateUrl: './ui-modal-component.html',
  styleUrl: './ui-modal-component.scss'
})
export class UiModalComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Input() size: string = 'md';

  // الكلمة فقط هي المتغيرة
  @Input() confirmLabel: string = 'حفظ';
  @Input() cancelLabel: string = 'إلغاء';

  @Input() isConfirmDisabled: boolean = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
}