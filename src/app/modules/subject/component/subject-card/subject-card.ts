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
  //inject toast service to show error message when delete failed or change toggle failed
  private toastr = inject(ToastrService);
  @Input() subject!: ISubject;

  @Output() toggleActive = new EventEmitter<boolean>();
  @Output() edit = new EventEmitter<ISubject>();
  @Output() delete = new EventEmitter<ISubject>();

  isMenuOpen = false;
  isConfirmOpen = false; // ضفنا State جديدة للديالوج في الكارت

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

  // --- دوال الحذف الجديدة ---

  onDeleteClick(): void {
    this.isMenuOpen = false; // 1. اقفل المنيو فوراً
    this.isConfirmOpen = true; // 2. افتح الديالوج اللي بره المنيو

  }

  onCancelDelete(): void {
    this.isConfirmOpen = false; // لو داس إلغاء نقفل الديالوج بس
  }

  onConfirmDelete(): void {
    this.isConfirmOpen = false; // نقفل الديالوج
    this.delete.emit(this.subject); // نبعت للـ Page تنفذ الحذف في الـ API
    this.toastr.success(`تم حذف المادة بنجاح`);
  }
}
