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
import { ISelectOption } from '../../../../../core/interface/ISelectOption';
import { IRegion } from '../../../../../core/interface/IRegion';

@Component({
  selector: 'app-region-modal',
  standalone: false,
  templateUrl: './region-modal.html',
  styleUrl: './region-modal.scss',
})
export class RegionModal implements OnInit, OnChanges {
  private readonly fb = inject(FormBuilder);

  @Input() isOpen = false;
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() regionData: IRegion | null = null;
  @Input() governorateOptions: ISelectOption[] = [];

  @Output() closeModal = new EventEmitter<void>();
  @Output() save = new EventEmitter<Partial<IRegion>>();

  regionForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen && this.regionForm) {
      this.handleModalOpen();
    }
  }

  onSubmit(): void {
    if (this.regionForm.invalid) {
      this.regionForm.markAllAsTouched();
      return;
    }

    const value = this.regionForm.value;
    const selectedGovernorate = this.governorateOptions.find(
      (option) => String(option.id) === String(value.governorateId),
    );
    const payload: Partial<IRegion> = {
      ...value,
      governorateId: String(value.governorateId),
      governorateName: selectedGovernorate?.option ?? this.regionData?.governorateName ?? '',
      deliveryPrice: Number(value.deliveryPrice),
      addedAt:
        this.mode === 'add'
          ? new Date().toISOString()
          : this.regionData?.addedAt ?? new Date().toISOString(),
    };

    if (this.mode === 'add') {
      delete payload.id;
    }

    this.save.emit(payload);
  }

  private initForm(): void {
    this.regionForm = this.fb.group({
      id: [null],
      governorateId: [null, Validators.required],
      name: ['', Validators.required],
      deliveryPrice: [0, [Validators.required, Validators.min(0)]],
      isActive: [true],
    });
  }

  private handleModalOpen(): void {
    if (this.mode === 'edit' && this.regionData) {
      this.regionForm.patchValue({
        id: this.regionData.id,
        governorateId: String(this.regionData.governorateId),
        name: this.regionData.name,
        deliveryPrice: this.regionData.deliveryPrice,
        isActive: this.regionData.isActive,
      });
      return;
    }

    this.regionForm.reset({
      id: null,
      governorateId: null,
      name: '',
      deliveryPrice: 0,
      isActive: true,
    });
  }
}
