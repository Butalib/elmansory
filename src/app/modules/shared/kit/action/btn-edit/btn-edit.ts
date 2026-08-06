import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-btn-edit',
  standalone: false,
  templateUrl: './btn-edit.html',
  styleUrl: './btn-edit.scss',
})
export class BtnEdit {
  @Output() edit = new EventEmitter<void>();

  onEdit(): void {
    this.edit.emit();
  }

}
