import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ISelectOption } from '../../../../../core/interface/ISelectOption';
import { INotebook } from '../../../../../core/interface/INotebook';

@Component({
  selector: 'app-notebook-form',
  standalone: false,
  templateUrl: './notebook-form.html',
  styleUrl: './notebook-form.scss',
})
export class NotebookFormComponent implements OnInit, OnChanges {
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() notebook: INotebook | null = null;
  @Input() teachers: ISelectOption[] = [];
  @Input() subjects: ISelectOption[] = [];
  @Input() levels: ISelectOption[] = [];
  @Input() isSaving = false;

  @Output() save = new EventEmitter<INotebook>();
  @Output() cancel = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  form!: FormGroup;
  imagePreviewUrl: string | null = null;

  ngOnInit(): void {
    this.initForm();
    this.patchForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['notebook'] || changes['mode']) && this.form) {
      this.patchForm();
    }
  }

  getControl(controlName: string): FormControl {
    return this.form.get(controlName) as FormControl;
  }

  onImageSelected(imageUrl: string | null): void {
    this.form.patchValue({ imageUrl: imageUrl ?? '' });
    this.imagePreviewUrl = imageUrl;
    this.changeDetectorRef.detectChanges();
  }

  clearImage(event: Event, input: HTMLInputElement): void {
    event.stopPropagation();
    input.value = '';
    this.onImageSelected(null);
  }

  onImageFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file || !file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        this.onImageSelected(reader.result);
      }
      input.value = '';
    };
    reader.readAsDataURL(file);
  }

  setToggle(controlName: string, value: boolean): void {
    this.getControl(controlName).setValue(value);
    this.getControl(controlName).markAsTouched();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const teacher = this.teachers.find((item) => item.id === value.teacherId);
    const subject = this.subjects.find((item) => item.id === value.subjectId);
    const level = this.levels.find((item) => item.id === value.levelId);
    const quantity = Number(value.quantity);

    this.save.emit({
      ...(this.notebook ?? ({} as INotebook)),
      name: value.name,
      imageUrl: value.imageUrl,
      teacherId: value.teacherId,
      teacherName: teacher?.option ?? this.notebook?.teacherName ?? '',
      subjectId: value.subjectId,
      subjectName: subject?.option ?? this.notebook?.subjectName ?? '',
      levelId: value.levelId,
      levelName: level?.option ?? this.notebook?.levelName ?? '',
      price: Number(value.price),
      discountPercentage: value.discountPercentage ? Number(value.discountPercentage) : 0,
      quantity,
      status: quantity <= 0 ? 'unavailable' : quantity <= 60 ? 'lowStock' : 'available',
      isActive: value.isActive,
      isFeatured: value.isFeatured,
      isSchoolReady: value.isSchoolReady,
      createdAt: this.notebook?.createdAt ?? new Date().toISOString(),
    });
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      teacherId: ['', Validators.required],
      subjectId: ['', Validators.required],
      levelId: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      quantity: [null, [Validators.required, Validators.min(0)]],
      discountPercentage: [null, Validators.min(0)],
      imageUrl: [''],
      isFeatured: [false],
      isSchoolReady: [false],
      isActive: [true],
    });
  }

  private patchForm(): void {
    if (!this.form) {
      return;
    }

    if (!this.notebook || this.mode === 'add') {
      this.form.reset({
        name: '',
        teacherId: '',
        subjectId: '',
        levelId: '',
        price: null,
        quantity: null,
        discountPercentage: null,
        imageUrl: '',
        isFeatured: false,
        isSchoolReady: false,
        isActive: true,
      });
      this.imagePreviewUrl = null;
      return;
    }

    this.imagePreviewUrl = this.notebook.imageUrl ?? null;

    this.form.patchValue({
      name: this.notebook.name,
      teacherId: this.notebook.teacherId ?? '',
      subjectId: this.notebook.subjectId ?? '',
      levelId: this.notebook.levelId ?? '',
      price: this.notebook.price,
      quantity: this.notebook.quantity,
      discountPercentage: this.notebook.discountPercentage ?? null,
      imageUrl: this.notebook.imageUrl ?? '',
      isFeatured: this.notebook.isFeatured ?? false,
      isSchoolReady: this.notebook.isSchoolReady ?? false,
      isActive: this.notebook.isActive ?? true,
    });
  }
}
