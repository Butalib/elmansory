import { Component, EventEmitter, Input, Output, HostListener, ElementRef, inject } from '@angular/core';
import { ISubject } from '../../../../core/interface/ISubject';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-subject-card',
  standalone: false,
  templateUrl: './subject-card.html',
  styleUrl: './subject-card.scss',
})
export class SubjectCard {

  private toastr = inject(ToastrService);
  @Input() subject!: ISubject;

  @Output() toggleActive = new EventEmitter<boolean>();
  @Output() edit = new EventEmitter<ISubject>();
  @Output() delete = new EventEmitter<ISubject>();

  isMenuOpen = false;
  isConfirmOpen = false;

  constructor(private eRef: ElementRef) { }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onToggle(checked: boolean): void {
    this.toggleActive.emit(checked);
    this.toastr.success(`تم ${checked ? 'تفعيل' : 'تعطيل'} المادة بنجاح`);
  }

  onEditAction(): void {
    this.isMenuOpen = false;
    this.edit.emit(this.subject);
  }


  onDeleteClick(): void {
    this.isMenuOpen = false;
    this.isConfirmOpen = true;

  }

  onCancelDelete(): void {
    this.isConfirmOpen = false;
  }

  onConfirmDelete(): void {
    this.isConfirmOpen = false;
    this.delete.emit(this.subject);
    this.toastr.success(`تم حذف المادة بنجاح`);
  }
}
