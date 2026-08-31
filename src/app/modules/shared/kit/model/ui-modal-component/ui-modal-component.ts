import { Component, Input, Output, EventEmitter } from '@angular/core';

type ModalSize = 'vsm' | 'sm' | 'md' | 'lg' | 'xl';
@Component({
  selector: 'app-modal-container',
  standalone: false,
  templateUrl: './ui-modal-component.html',
  styleUrl: './ui-modal-component.scss'
})
export class UiModalComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Input() size: ModalSize = 'md';

  @Input() confirmLabel: string = 'حفظ';
  @Input() cancelLabel: string = 'إلغاء';

  @Input() isConfirmDisabled: boolean = false;
  @Input() confirmTheme: 'primary' | 'error' | 'success' = 'primary';

  @Output() closeModal = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  onBackdropClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal-backdrop')) {
      this.closeModal.emit();
    }
  }
}