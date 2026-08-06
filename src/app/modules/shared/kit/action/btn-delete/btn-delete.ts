import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-btn-delete',
  standalone: false,
  templateUrl: './btn-delete.html',
  styleUrl: './btn-delete.scss',
})
export class BtnDelete {

  @Output() delete = new EventEmitter<void>();

  onDelete(): void {
    this.delete.emit();
  }


}
