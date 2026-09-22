import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITeacher } from '../../../../core/interface/ITeacher';
import { ISelectOption } from '../../../../core/interface/ISelectOption';

@Component({
  selector: 'app-teachers-modal',
  standalone: false,
  templateUrl: './teachers-modal.html',
  styleUrl: './teachers-modal.scss',
})
export class TeachersModal implements OnInit, OnChanges {
  private readonly fb = inject(FormBuilder);


  @Input() isOpen = false;
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() teacherData: ITeacher | null = null;
  @Input() levelsList: ISelectOption[] = [];
  @Input() subjectsList: ISelectOption[] = [];


  @Output() closeModal = new EventEmitter<void>();
  @Output() save = new EventEmitter<Partial<ITeacher>>();


  teacherForm!: FormGroup;
  selectedFile: string | null = null;
  existingAvatarUrl: string | null = null;

  ngOnInit(): void {
    this.initForm();
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.handleModalOpen();
    }
  }

  private initForm(): void {
    this.teacherForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      levelId: [null, Validators.required],
      subjectId: [null, Validators.required],
      isActive: [true]
    });
  }

  private handleModalOpen(): void {
    if (this.mode === 'edit' && this.teacherData) {
      this.teacherForm.patchValue({
        id: this.teacherData.id,
        name: this.teacherData.name,
        levelId: this.teacherData.levelId,
        subjectId: this.teacherData.subjectId,
        isActive: this.teacherData.isActive
      });
      this.existingAvatarUrl = this.teacherData.avatar;
    } else {
      this.teacherForm?.reset({ isActive: true });
      this.existingAvatarUrl = null;
      this.selectedFile = null;
    }
  }

  onFileSelected(file: string | null): void {
    this.selectedFile = file;
  }

  onSubmit(): void {
    if (this.teacherForm.invalid) return;

    const formValues = this.teacherForm.value;

    const selectedLevel = this.levelsList.find(l => String(l.id) === String(formValues.levelId));
    const selectedSubject = this.subjectsList.find(s => String(s.id) === String(formValues.subjectId));

    const payload: Partial<ITeacher> = {
      ...formValues,
      levelName: selectedLevel?.option ?? 'غير محدد',
      subjectName: selectedSubject?.option ?? 'غير محدد',
      reservedSessions: this.mode === 'add' ? 0 : (this.teacherData?.reservedSessions || 0),
      avatar: this.selectedFile ?? 'assets/img/dashbourd/avatar.jpg'
    };

    if (this.mode === 'add') {
      delete payload.id;
    }

    this.save.emit(payload);
  }
}