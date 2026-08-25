import { Component, inject, OnInit } from '@angular/core';
import { Teachers } from '../../../../core/service/teachers.service';
import { FormBuilder } from '@angular/forms';
import { ITeacher } from '../../../../core/interface/ITeacher';
import { ITableColumn } from '../../../../core/interface/IGenericTable';
import { ISelectOption } from '../../../../core/interface/ISelectOption';
import { LookupService } from '../../../../core/service/lookup.service';
import { ToastrService } from 'ngx-toastr';
import { HybridQueryEngine } from '../../../../core/service/data/hybrid-query-engine.service';

@Component({
  selector: 'app-teacher-page',
  standalone: false,
  templateUrl: './teacher-page.html',
  styleUrl: './teacher-page.scss',
})
export class TeacherPage implements OnInit {
  private readonly teachersService = inject(Teachers);
  private readonly lookupService = inject(LookupService);
  private readonly toaster = inject(ToastrService);
  private readonly fb = inject(FormBuilder);

  // 1. Table Configuration
  tableColumns: ITableColumn[] = [
    { key: 'name', label: 'اسم المعلم', type: 'user', imageKey: 'avatar' },
    { key: 'levelName', label: 'الفصل الدراسي', type: 'text' },
    { key: 'subjectName', label: 'المادة', type: 'text' },
    { key: 'reservedSessions', label: 'عدد الحصص المحجوزة', type: 'text' },
    {
      key: 'actions',
      label: 'الاجراء',
      type: 'actions',
      hasToggle: true,
      toggleKey: 'isActive',
      actions: [
        { id: 'edit', label: 'تعديل', icon: 'assets/icon/shared/edit.svg' },
        { id: 'delete', label: 'حذف', icon: 'assets/icon/shared/delete-02.svg', color: '#EF4444' }
      ]
    }
  ];

  // 2. Query Engine Setup
  readonly engine = new HybridQueryEngine<ITeacher>(
    (query) => this.teachersService.loadByQuery(query),
    (data, query) => this.filterLocally(data, query),
    this.teachersService.items$,
    'local'
  );

  // 3. UI & Form State
  isModalOpen = false;
  modalMode: 'add' | 'edit' = 'add';
  selectedTeacherForEdit: ITeacher | null = null;
  // 4. Lookups
  levelsList: ISelectOption[] = [];
  subjectsList: ISelectOption[] = [];
  isConfirmationDialogOpen = false;
  isDeleting = false;
  teacherIdToDelete: string | null = null;

  ngOnInit(): void {
    this.engine.patchQuery({ _sort: 'name', _order: 'asc' });
    this.teachersService.loadAll().subscribe();
    this.loadInitialLookups();
  }

  private loadInitialLookups(): void {
    // افترض إن الـ endpoints دي موجودة في الـ db.json
    this.lookupService.getOptions('levels', 'subLevel').subscribe(res => this.levelsList = res); this.lookupService.getOptions('subjects').subscribe(res => this.subjectsList = res);
  }

  // === Modal Actions ===
  openModal(mode: 'add' | 'edit', teacher?: ITeacher): void {
    this.modalMode = mode;
    this.selectedTeacherForEdit = teacher || null;
    this.isModalOpen = true;
  }
  closeModal(): void {
    this.isModalOpen = false;
    this.selectedTeacherForEdit = null;
  }


  // === Save Logic (Data Mapping) ===
  onSaveTeacher(payload: Partial<ITeacher>): void {
    if (this.modalMode === 'add') {
      this.teachersService.add(payload as ITeacher).subscribe({
        next: () => {
          this.toaster.success('تمت إضافة المعلم بنجاح');
          this.lookupService.invalidateCache('teachers'); // بنمسح الكاش عشان لو فيه أي مودال تاني يجيب أحدث داتا
          this.closeModal();
        },
        error: (err) => {
          this.toaster.error('حدث خطأ أثناء إضافة المعلم');
          console.error(err);
        }
      });
    } else {
      this.teachersService.update(payload.id as string, payload).subscribe({
        next: () => {
          this.toaster.success('تم تعديل بيانات المعلم بنجاح');
          this.lookupService.invalidateCache('teachers'); // بنمسح الكاش عشان لو فيه أي مودال تاني يجيب أحدث داتا
          this.closeModal();
        },
        error: (err) => {
          this.toaster.error('حدث خطأ أثناء تعديل بيانات المعلم');
          console.error(err);
        }
      });
    }
  }

  onTableActionClick(event: { actionId: string; row: ITeacher }): void {
    if (event.actionId === 'edit') {
      this.openModal('edit', event.row);
    } else if (event.actionId === 'delete') {
      this.teacherIdToDelete = event.row.id;
      this.isConfirmationDialogOpen = true;
    }
  }
  confirmDelete(): void {
    console.log('Confirm Delete Clicked' + ' ' + this.teacherIdToDelete);
    if (!this.teacherIdToDelete) return;

    this.isDeleting = true; // تشغيل الـ Spinner

    this.teachersService.delete(this.teacherIdToDelete).subscribe({
      next: () => {
        this.toaster.success('تم الحذف بنجاح');
        this.lookupService.invalidateCache('teachers'); // بنمسح الكاش عشان لو فيه أي مودال تاني يجيب أحدث داتا
        this.closeConfirmDialog();
      },
      error: (err) => {
        console.error('Delete Error:', err);
        this.toaster.error('حدث خطأ أثناء الحذف');
        this.isDeleting = false; // بنقفل الـ Spinner بس وممكن نسيب المودال مفتوح
      }
    });
  }

  // 3. دالة إغلاق المودال وتفريغ الحالة
  closeConfirmDialog(): void {
    this.isConfirmationDialogOpen = false;
    this.teacherIdToDelete = null;
    this.isDeleting = false;
  }

  onToggleChange(event: { key: string; row: ITeacher; value: boolean }): void {
    if (event.key === 'isActive') {
      this.teachersService.update(event.row.id, { isActive: event.value }).subscribe(() => {
        this.toaster.info('تم تغيير حالة المعلم');
      });
    }
  }

  // === Header Actions ===
  onSearch(searchTerm: string): void {
    this.engine.patchQuery({ searchTerm });
  }

  onPageChange(newPage: number): void {
    this.engine.patchQuery({ _page: newPage });
  }

  private filterLocally(data: ITeacher[], query: any): ITeacher[] {
    if (!query.searchTerm) return data;
    const term = query.searchTerm.toLowerCase();
    return data.filter(teacher =>
      teacher.name?.toLowerCase().includes(term) ||
      teacher.subjectName?.toLowerCase().includes(term) ||
      teacher.levelName?.toLowerCase().includes(term)
    );
  }
}