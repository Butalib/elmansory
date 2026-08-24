import { Component, EventEmitter, Input, Output } from '@angular/core';
type ModalSize = 'vsm' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: false,
  templateUrl: './confirmation-dialog.html',
  styleUrl: './confirmation-dialog.scss',
})
export class ConfirmationDialog {

  @Input() isOpen: boolean = false;
  @Input() title: string = 'تأكيد الإجراء';
  @Input() message: string = 'هل أنت متأكد من تنفيذ هذا الإجراء؟';
  @Input() confirmLabel: string = 'تأكيد';
  @Input() cancelLabel: string = 'إلغاء';
  @Input() size: ModalSize = 'vsm';

  @Input() confirmTheme: 'primary' | 'error' | 'success' = 'error';
  @Input() isLoading: boolean = false; // لحالة تحميل الزرار

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

}
