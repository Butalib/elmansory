import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IGovernorate } from '../../../../../core/interface/IGovernorate';

@Component({
  selector: 'app-governorate-modal',
  standalone: false,
  templateUrl: './governorate-modal.html',
  styleUrl: './governorate-modal.scss',
})
export class GovernorateModal implements OnInit, OnChanges {
  private readonly fb = inject(FormBuilder);

  @Input() isOpen = false;
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() governorateData: IGovernorate | null = null;

  @Output() closeModal = new EventEmitter<void>();
  @Output() save = new EventEmitter<Partial<IGovernorate>>();

  governorateForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen && this.governorateForm) {
      this.handleModalOpen();
    }
  }

  onSubmit(): void {
    if (this.governorateForm.invalid) {
      this.governorateForm.markAllAsTouched();
      return;
    }

    const value = this.governorateForm.value;
    const payload: Partial<IGovernorate> = {
      ...value,
      regionsCount: this.mode === 'add' ? 0 : this.governorateData?.regionsCount ?? 0,
      addedAt:
        this.mode === 'add'
          ? new Date().toISOString()
          : this.governorateData?.addedAt ?? new Date().toISOString(),
    };

    if (this.mode === 'add') {
      delete payload.id;
    }

    this.save.emit(payload);
  }

  private initForm(): void {
    this.governorateForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      isActive: [true],
    });
  }

  private handleModalOpen(): void {
    if (this.mode === 'edit' && this.governorateData) {
      this.governorateForm.patchValue({
        id: this.governorateData.id,
        name: this.governorateData.name,
        isActive: this.governorateData.isActive,
      });
      return;
    }

    this.governorateForm.reset({
      id: null,
      name: '',
      isActive: true,
    });
  }
}
