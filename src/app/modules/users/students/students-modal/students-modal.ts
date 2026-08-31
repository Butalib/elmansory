import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IStudent } from '../../../../core/interface/IStudent';
import { ISelectOption } from '../../../../core/interface/ISelectOption';

@Component({
  selector: 'app-students-modal',
  standalone: false,
  templateUrl: './students-modal.html',
  styleUrl: './students-modal.scss',
})
export class StudentsModal implements OnInit, OnChanges {
  private readonly fb = inject(FormBuilder);

  // === Inputs ===
  @Input() isOpen = false;
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() studentData: IStudent | null = null;
  @Input() levelsList: ISelectOption[] = [];
  // === Outputs ===
  @Output() closeModal = new EventEmitter<void>();
  @Output() save = new EventEmitter<Partial<IStudent>>();

  // === Local State ===
  studentForm!: FormGroup;
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
    this.studentForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      phone: ['', [
        Validators.required,
        Validators.pattern('^01[0125][0-9]{8}$')]],
      levelId: [null, Validators.required],
      birthDate: [null, Validators.required],
      joinDate: [null, Validators.required],
      isActive: [true]
    });
  }

  private handleModalOpen(): void {
    if (!this.studentForm) {
      this.initForm();
    }

    if (this.mode === 'edit' && this.studentData) {
      this.studentForm.patchValue({
        id: this.studentData.id,
        name: this.studentData.name,
        phone: this.studentData.phone,
        levelId: this.studentData.levelId,
        birthDate: this.studentData.birthDate,
        joinDate: this.studentData.joinDate,
        isActive: this.studentData.isActive
      });
      this.existingAvatarUrl = this.studentData.avatar ?? null;
    } else {
      this.studentForm.reset({ isActive: true });
      this.existingAvatarUrl = null;
      this.selectedFile = null;
    }
  }

  onFileSelected(file: string | null): void {
    this.selectedFile = file;
  }

  onSubmit(): void {
    if (this.studentForm.invalid) return;

    const formValues = this.studentForm.value;
    const selectedLevel = this.levelsList.find(l => String(l.id) === String(formValues.levelId));

    const payload: Partial<IStudent> = {
      ...formValues,
      levelName: selectedLevel?.option ?? 'غير محدد',
      ordersCount: this.mode === 'add' ? 0 : (this.studentData?.ordersCount || 0),
      wheelUses: this.mode === 'add' ? 0 : (this.studentData?.wheelUses || 0),
      avatar: this.selectedFile ?? this.existingAvatarUrl ?? 'assets/img/dashbourd/avatar.jpg'
    };

    if (this.mode === 'add') {
      delete payload.id;
    }

    this.save.emit(payload);
  }
}