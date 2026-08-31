import { Component, OnInit, OnDestroy, computed, inject } from '@angular/core';
import { ISubject } from '../../../../app/core/interface/ISubject';
import { Observable } from 'rxjs';
import { SubjectService } from '../../../core/service/subject.service';
import { HybridQueryEngine } from '../../../core/service/data/hybrid-query-engine.service';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from '../../../core/service/lookup.service';
import { LoadingService } from '../../../core/service/loading.service';
@Component({
  selector: 'app-subject-page',
  standalone: false,
  templateUrl: './subject-page.html',
  styleUrl: './subject-page.scss',
})
export class SubjectPage implements OnInit, OnDestroy {
  private readonly lookupService = inject(LookupService);
  private readonly loadingService = inject(LoadingService);
  readonly isLoading = computed(() => this.loadingService.isPageLoading());
  readonly subjectSkeletonItems = Array.from({ length: 4 });

  queryEngine!: HybridQueryEngine<ISubject>;
  subjects$!: Observable<ISubject[]>;

  isFormModalOpen = false;
  formMode: 'add' | 'edit' = 'add';
  selectedSubjectId: string | number | null = null;
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

        filteredData.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });

        // 2. الفلترة (البحث)
        if (query['searchTerm']) {
          const term = query['searchTerm'].toString().toLowerCase();
          filteredData = filteredData.filter(s =>
            s.name.toLowerCase().includes(term)
          );
        }

        if (query['startDate'] && query['endDate']) {
          filteredData = filteredData.filter((subject) => {
            const subjectDate =
              typeof subject.createdAt === 'string'
                ? subject.createdAt.split('T')[0]
                : subject.createdAt.toISOString().split('T')[0];

            return subjectDate >= query['startDate'] && subjectDate <= query['endDate'];
          });
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

  onDateRangeChange(range: { startDate: string; endDate: string }): void {
    this.queryEngine.patchQuery({ startDate: range.startDate, endDate: range.endDate });
  }

  onToggleStatus(subject: ISubject, isActive: boolean): void {
    const updatedSubject = { ...subject, isActive };
    this.subjectService.update(subject.id, updatedSubject).subscribe();
  }

  onDeleteSubject(subject: ISubject): void {
    this.subjectService.delete(subject.id).subscribe();
    this.lookupService.invalidateCache('subjects');
  }


  onAddSubject(): void {
    this.formMode = 'add';
    this.selectedSubjectId = null;
    this.subjectNameControl.reset();
    this.isFormModalOpen = true;
  }

  onEditSubject(subject: ISubject): void {
    this.formMode = 'edit';
    this.selectedSubjectId = subject.id;
    this.subjectNameControl.setValue(subject.name);
    this.isFormModalOpen = true;
  }

  closeFormModal(): void {
    this.isFormModalOpen = false;
    this.subjectNameControl.reset();
  }

  saveSubject(): void {
    if (this.subjectNameControl.invalid) return;

    const subjectName = this.subjectNameControl.value as string;

    if (this.formMode === 'add') {
      const newSubject = {
        name: subjectName,
        isActive: true,
        createdAt: new Date().toISOString()
      };

      this.subjectService.add(newSubject as ISubject).subscribe(() => {
        this.toastr.success('تم إضافة المادة بنجاح');
        this.lookupService.invalidateCache('subjects');
        this.closeFormModal();
      });

    } else if (this.formMode === 'edit' && this.selectedSubjectId) {
      const updatedData = { name: subjectName };

      this.subjectService.update(this.selectedSubjectId, updatedData).subscribe(() => {
        this.toastr.success('تم تعديل المادة بنجاح');
        this.lookupService.invalidateCache('subjects');
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
