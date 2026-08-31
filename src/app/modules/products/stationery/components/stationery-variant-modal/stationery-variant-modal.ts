import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IStationeryVariant } from '../../../../../core/interface/IStationery';

@Component({
  selector: 'app-stationery-variant-modal',
  standalone: false,
  templateUrl: './stationery-variant-modal.html',
  styleUrl: './stationery-variant-modal.scss',
})
export class StationeryVariantModal implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() variant: IStationeryVariant | null = null;

  @Output() save = new EventEmitter<IStationeryVariant>();
  @Output() cancel = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  form!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.patchForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['variant'] || changes['isOpen']) && this.form) {
      this.patchForm();
    }
  }

  getControl(controlName: string): FormControl {
    return this.form.get(controlName) as FormControl;
  }

  setActive(value: boolean): void {
    this.getControl('isActive').setValue(value);
    this.getControl('isActive').markAsTouched();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    this.save.emit({
      id: this.variant?.id ?? Date.now().toString(),
      color: value.color,
      size: value.size,
      price: Number(value.price),
      quantity: Number(value.quantity),
      isActive: value.isActive,
    });
  }

  private initForm(): void {
    this.form = this.fb.group({
      color: ['', Validators.required],
      size: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      quantity: [null, [Validators.required, Validators.min(0)]],
      isActive: [true],
    });
  }

  private patchForm(): void {
    this.form.reset({
      color: this.variant?.color ?? '',
      size: this.variant?.size ?? '',
      price: this.variant?.price ?? null,
      quantity: this.variant?.quantity ?? null,
      isActive: this.variant?.isActive ?? true,
    });
  }
}
