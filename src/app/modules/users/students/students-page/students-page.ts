import { Component, inject, OnInit } from '@angular/core';
import { StudentsService } from '../../../../core/service/students.service';
import { LookupService } from '../../../../core/service/lookup.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { IKpi } from '../../../../core/interface/IKpi';
import { ITableColumn } from '../../../../core/interface/IGenericTable';
import { HybridQueryEngine } from '../../../../core/service/data/hybrid-query-engine.service';
import { IStudent } from '../../../../core/interface/IStudent';
import { ISelectOption } from '../../../../core/interface/ISelectOption';

@Component({
  selector: 'app-students-page',
  standalone: false,
  templateUrl: './students-page.html',
  styleUrl: './students-page.scss',
})
export class StudentsPage implements OnInit {
  private readonly studentsService = inject(StudentsService);
  private readonly lookupService = inject(LookupService);
  private readonly toaster = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);


  kpiStats: IKpi[] = [
    {
      id: '1',
      title: 'إجمالي الطلاب',
      value: '4',
      icon: 'assets/icon/shared/kpi/student/user.svg',
      iconBgColor: 'var(--color-primary-50)',
    },
    {
      id: '2',
      title: 'الطلاب النشطين',
      value: '2',
      icon: 'assets/icon/shared/kpi/student/user-check.svg',
      iconBgColor: 'var(--color-primary-50)',
    },
    {
      id: '3',
      title: 'الطلاب الموقوفين',
      value: '2',
      icon: 'assets/icon/shared/kpi/student/user-x.svg',
      iconBgColor: 'var(--color-primary-50)',
    },
  ];


  tableColumns: ITableColumn[] = [
    { key: 'name', label: 'اسم العميل', type: 'user', imageKey: 'avatar' },
    { key: 'phone', label: 'رقم الهاتف', type: 'text' },
    { key: 'birthDate', label: 'تاريخ الميلاد', type: 'date' },
    { key: 'joinDate', label: 'تاريخ الانضمام', type: 'date' },
    { key: 'ordersCount', label: 'عدد الطلبات', type: 'text' },
    { key: 'wheelUses', label: 'عدد مرات استخدام العجلة', type: 'text' },
    {
      key: 'actions',
      label: 'اجراء',
      type: 'actions',
      hasToggle: true,
      toggleKey: 'isActive',
      actions: [
        { id: 'view', label: ' تفاصيل', icon: 'assets/icon/shared/eye.svg' },
        { id: 'edit', label: 'تعديل', icon: 'assets/icon/shared/edit.svg' },
        { id: 'delete', label: 'حذف', icon: 'assets/icon/shared/delete-02.svg', color: 'var(--color-error-500)' },
      ],
    },
  ];


  readonly engine = new HybridQueryEngine<IStudent>(
    (query) => this.studentsService.loadByQuery(query),
    (data, query) => this.filterLocally(data, query),
    this.studentsService.items$,
    'local',
  );


  isModalOpen = false;
  modalMode: 'add' | 'edit' = 'add';
  selectedStudentForEdit: IStudent | null = null;
  levelsList: ISelectOption[] = [];

  isConfirmationDialogOpen = false;
  isDeleting = false;
  studentIdToDelete: string | null = null;

  ngOnInit(): void {
    this.engine.patchQuery({ _sort: 'joinDate', _order: 'desc' });
    this.studentsService.loadAll().subscribe();
    this.loadInitialLookups();
  }

  private loadInitialLookups(): void {
    this.lookupService.getOptions('levels', 'subLevel').subscribe((res) => (this.levelsList = res));
  }

  onPageChange(newPage: number): void {
    this.engine.patchQuery({ _page: newPage });
  }

  onSearch(searchTerm: string): void {
    this.engine.patchQuery({ searchTerm, _page: 1 });
  }

  onDateRangeChange(range: { startDate: string; endDate: string }): void {
    this.engine.patchQuery({ startDate: range.startDate, endDate: range.endDate, _page: 1 });
  }

  onSortChange(sortKey: string, sortDirection: 'asc' | 'desc'): void {
    this.engine.patchQuery({ _sort: sortKey, _order: sortDirection });
  }

  onTableActionClick(event: { actionId: string; row: IStudent }): void {
    if (event.actionId === 'edit') {
      this.openModal('edit', event.row);
    } else if (event.actionId === 'delete') {
      this.studentIdToDelete = event.row.id;
      this.isConfirmationDialogOpen = true;
    } else if (event.actionId === 'view') {
      this.router.navigate(['details', event.row.id], { relativeTo: this.route });
    }
  }

  onToggleChange(event: { key: string; row: IStudent; value: boolean }): void {
    if (event.key === 'isActive') {
      this.studentsService.update(event.row.id, { isActive: event.value }).subscribe(() => {
        this.toaster.info('تم تحديث حالة الطالب بنجاح');
      });
    }
  }

  openModal(mode: 'add' | 'edit', student?: IStudent): void {
    this.modalMode = mode;
    this.selectedStudentForEdit = student || null;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedStudentForEdit = null;
  }

  onSaveStudent(payload: Partial<IStudent>): void {
    if (this.modalMode === 'add') {
      this.studentsService.add(payload as IStudent).subscribe({
        next: () => {
          this.toaster.success('تمت إضافة الطالب بنجاح');
          this.closeModal();
          this.engine.patchQuery({ _page: 1 });
        },
        error: (err) => {
          this.toaster.error('حدث خطأ أثناء الإضافة');
          console.error(err);
        },
      });
    } else {
      this.studentsService.update(payload.id as string, payload).subscribe({
        next: () => {
          this.toaster.success('تم تعديل بيانات الطالب بنجاح');
          this.closeModal();
        },
        error: (err) => {
          this.toaster.error('حدث خطأ أثناء التعديل');
          console.error(err);
        },
      });
    }
  }


  confirmDelete(): void {
    if (!this.studentIdToDelete) return;
    this.isDeleting = true;

    this.studentsService.delete(this.studentIdToDelete).subscribe({
      next: () => {
        this.toaster.success('تم حذف الطالب بنجاح');
        this.lookupService.invalidateCache('students');
        this.closeConfirmDialog();
      },
      error: (err) => {
        this.toaster.error('حدث خطأ أثناء الحذف');
        this.isDeleting = false;
      },
    });
  }
  closeConfirmDialog(): void {
    this.isConfirmationDialogOpen = false;
    this.studentIdToDelete = null;
    this.isDeleting = false;
  }
  private filterLocally(data: IStudent[], query: any): IStudent[] {
    let filteredData = data;

    if (query.searchTerm) {
      const term = query.searchTerm.toLowerCase();
      filteredData = filteredData.filter(
        (student) =>
          student.name?.toLowerCase().includes(term) ||
          student.phone?.toLowerCase().includes(term) ||
          student.levelName?.toLowerCase().includes(term),
      );
    }
    if (query.startDate && query.endDate) {
      filteredData = filteredData.filter((student) => {
        const studentJoinDate =
          typeof student.joinDate === 'string'
            ? student.joinDate.split('T')[0]
            : new Date(student.joinDate).toISOString().split('T')[0];

        return studentJoinDate >= query.startDate && studentJoinDate <= query.endDate;
      });
    }
    return filteredData;
  }
}
