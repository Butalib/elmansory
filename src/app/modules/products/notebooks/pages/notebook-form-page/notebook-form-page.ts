import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ISelectOption } from '../../../../../core/interface/ISelectOption';
import { INotebook } from '../../../../../core/interface/INotebook';
import { ILevels } from '../../../../../core/interface/ILevels';
import { LayoutServices } from '../../../../../core/service/Layout.service';
import { LevelsService } from '../../../../../core/service/levels.service';
import { LookupService } from '../../../../../core/service/lookup.service';
import { NotebooksService } from '../../../../../core/service/notebooks.service';

@Component({
  selector: 'app-notebook-form-page',
  standalone: false,
  templateUrl: './notebook-form-page.html',
  styleUrl: './notebook-form-page.scss',
})
export class NotebookFormPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notebooksService = inject(NotebooksService);
  private readonly lookupService = inject(LookupService);
  private readonly levelsService = inject(LevelsService);
  private readonly layoutServices = inject(LayoutServices);
  private readonly toastr = inject(ToastrService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  mode: 'add' | 'edit' = 'add';
  notebook: INotebook | null = null;
  teachers: ISelectOption[] = [];
  subjects: ISelectOption[] = [];
  levels: ISelectOption[] = [];
  isLoading = false;
  isSaving = false;
  hasLoadError = false;

  ngOnInit(): void {
    const notebookId = this.route.snapshot.paramMap.get('id');
    this.mode = notebookId ? 'edit' : 'add';
    this.layoutServices.pageTitle.set(this.mode === 'add' ? 'إضافة ملزمة جديدة' : 'تعديل تفاصيل الملزمة');
    this.loadLookups();

    if (notebookId) {
      this.isLoading = true;
      this.hasLoadError = false;
      this.notebooksService
        .getById<INotebook>(notebookId)
        .subscribe({
          next: (notebook: INotebook) => {
            this.notebook = notebook;
            this.isLoading = false;
            this.syncView();
          },
          error: () => {
            this.isLoading = false;
            this.hasLoadError = true;
            this.toastr.error('حدث خطأ أثناء تحميل الملزمة');
            this.syncView();
          },
        });
    }
  }

  onSave(notebook: INotebook): void {
    this.isSaving = true;

    const request$ = this.mode === 'add' ? this.notebooksService.add(notebook) : this.createUpdateRequest(notebook);

    if (!request$) {
      this.isSaving = false;
      this.toastr.error('تعذر تحديد الملزمة المطلوب تعديلها');
      this.syncView();
      return;
    }

    request$.subscribe({
      next: () => {
        this.toastr.success(this.mode === 'add' ? 'تمت إضافة الملزمة بنجاح' : 'تم تعديل الملزمة بنجاح');
        this.goBack();
      },
      error: () => {
        this.isSaving = false;
        this.toastr.error('حدث خطأ أثناء حفظ الملزمة');
        this.syncView();
      },
    });
  }

  private createUpdateRequest(notebook: INotebook) {
    const notebookId = this.notebook?.id;
    return notebookId ? this.notebooksService.update(notebookId, notebook) : null;
  }

  goBack(): void {
    this.router.navigate(['/dashboard/layout/products/notebooks']);
  }

  private loadLookups(): void {
    this.lookupService.getOptions('teachers').subscribe((teachers) => {
      this.teachers = teachers;
      this.syncView();
    });
    this.lookupService.getOptions('subjects').subscribe((subjects) => {
      this.subjects = subjects;
      this.syncView();
    });
    this.levelsService
      .loadAll()
      .pipe(
        map((levels: ILevels[]) =>
          levels.map((level) => ({
            id: String(level.id),
            option: `${level.level} - ${level.subLevel}`,
          })),
        ),
      )
      .subscribe((levels) => {
        this.levels = levels;
        this.syncView();
      });
  }

  private syncView(): void {
    queueMicrotask(() => {
      if (!this.destroyRef.destroyed) {
        this.changeDetectorRef.detectChanges();
      }
    });
  }
}
