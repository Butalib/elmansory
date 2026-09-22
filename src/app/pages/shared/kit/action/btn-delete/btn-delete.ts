import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-btn-delete',
  standalone: false,
  templateUrl: './btn-delete.html',
  styleUrl: './btn-delete.scss',
})
export class BtnDelete {
  @Input() confirmTitle: string = 'تأكيد الحذف';
  @Input() confirmMessage: string = 'هل أنت متأكد من حذف هذا العنصر؟';
  @Input() confirmLabel: string = 'حذف';
  @Input() cancelLabel: string = 'إلغاء';
  @Output() delete = new EventEmitter<void>();
  isConfirmOpen = false;
  onDelete(): void {
    this.isConfirmOpen = true;
  }
  onCancelDelete(): void {
    this.isConfirmOpen = false;
  }
  onConfirmDelete(): void {
    this.isConfirmOpen = false;
    this.delete.emit();
  }
}
