import { Component, OnInit, OnDestroy } from '@angular/core';
import { ISubject } from '../../../../app/core/interface/ISubject';
import { Observable } from 'rxjs';
import { SubjectService } from '../../../core/service/subject.service';
import { HybridQueryEngine } from '../../../core/service/data/hybrid-query-engine.service';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-subject-page',
  standalone: false,
  templateUrl: './subject-page.html',
  styleUrl: './subject-page.scss',
})
export class SubjectPage implements OnInit, OnDestroy {
  queryEngine!: HybridQueryEngine<ISubject>;
  subjects$!: Observable<ISubject[]>;

  // === States الخاصة بالمودل ===
  isFormModalOpen = false;
  formMode: 'add' | 'edit' = 'add';
  selectedSubjectId: string | number | null = null; // عشان نحتفظ بالـ ID وقت التعديل

  // === FormControl لإدارة حقل الإدخال ===
  // حطينا Validators.required عشان نمنع المستخدم يسيف مادة ملهاش اسم
  subjectNameControl = new FormControl('', [Validators.required]);

  constructor(private subjectService: SubjectService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.subjectService.loadAll().subscribe();

    this.queryEngine = new HybridQueryEngine<ISubject>(
      (query) => this.subjectService.loadByQuery(query),
      (data, query) => {
        let filteredData = [...data];

        // 1. الترتيب: دايماً نعرض الأحدث فوق عشان بعد الريفرش المادة الجديدة متستخباش تحت
        filteredData.sort((a, b) => {
          // بنتأكد إن الـ createdAt موجود عشان ميحصلش إيرور
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA; // ترتيب تنازلي (الأحدث أولاً)
        });

        // 2. الفلترة (البحث)
        if (query['searchTerm']) {
          const term = query['searchTerm'].toString().toLowerCase();
          filteredData = filteredData.filter(s =>
            s.name.toLowerCase().includes(term)
          );
        }

        return filteredData;
      },
      this.subjectService.items$,
      'local'
    );
    this.subjects$ = this.queryEngine.result$;
  }

  onSearch(searchTerm: string): void {
    this.queryEngine.patchQuery({ searchTerm });
  }

  onToggleStatus(subject: ISubject, isActive: boolean): void {
    const updatedSubject = { ...subject, isActive };
    this.subjectService.update(subject.id, updatedSubject).subscribe();
  }

  onDeleteSubject(subject: ISubject): void {
    this.subjectService.delete(subject.id).subscribe();
  }

  // === دوال الإضافة والتعديل ===

  onAddSubject(): void {
    this.formMode = 'add';
    this.selectedSubjectId = null;
    this.subjectNameControl.reset(); // بنفضي الحقل قبل ما نفتح المودل
    this.isFormModalOpen = true;
  }

  onEditSubject(subject: ISubject): void {
    this.formMode = 'edit';
    this.selectedSubjectId = subject.id; // بنحتفظ بالـ ID عشان هنحتاجه وقت الـ Update
    this.subjectNameControl.setValue(subject.name); // بنحط اسم المادة الحالي في الحقل
    this.isFormModalOpen = true;
  }

  closeFormModal(): void {
    this.isFormModalOpen = false;
    this.subjectNameControl.reset();
  }

  saveSubject(): void {
    // لو الحقل فاضي أو غير صالح، بنوقف التنفيذ (حماية إضافية)
    if (this.subjectNameControl.invalid) return;

    const subjectName = this.subjectNameControl.value as string;

    if (this.formMode === 'add') {
      // بناء أوبجيكت المادة الجديدة
      const newSubject = {
        name: subjectName,
        isActive: true, // افتراضياً المادة الجديدة بتكون مفعلة
        createdAt: new Date().toISOString()
      };

      this.subjectService.add(newSubject as ISubject).subscribe(() => {
        this.toastr.success('تم إضافة المادة بنجاح');
        this.closeFormModal();
      });

    } else if (this.formMode === 'edit' && this.selectedSubjectId) {
      // بناء أوبجيكت التعديل (بنبعت الخاصية اللي اتغيرت بس)
      const updatedData = { name: subjectName };

      this.subjectService.update(this.selectedSubjectId, updatedData).subscribe(() => {
        this.toastr.success('تم تعديل المادة بنجاح');
        this.closeFormModal();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.queryEngine) {
      this.queryEngine.destroy();
    }
  }
}
