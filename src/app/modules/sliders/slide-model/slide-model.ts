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

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { ISlider } from '../../../core/interface/ISlider';
import { ISelectOption } from '../../../core/interface/ISelectOption';
import { LookupService } from '../../../core/service/lookup.service';

@Component({
  selector: 'app-slide-model',
  standalone: false,
  templateUrl: './slide-model.html',
  styleUrl: './slide-model.scss',
})
export class SlideModelComponent implements OnInit, OnChanges {


  @Input() isOpen = false;

  @Input() mode: 'add' | 'edit' = 'add';

  @Input() sliderData: ISlider | null = null;


  @Output() close = new EventEmitter<void>();

  @Output() save = new EventEmitter<ISlider>();


  sliderForm!: FormGroup;

  locations: ISelectOption[] = [];


  imageBase64: string | null = null;


  private readonly lookupService = inject(LookupService);

  private readonly fb = inject(FormBuilder);


  ngOnInit(): void {
    this.initForm();
    this.loadLocations();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['isOpen']) {
      return;
    }

    if (this.isOpen) {
      this.handleModalOpen();
      return;
    }

    this.resetFormState();
  }


  private initForm(): void {
    this.sliderForm = this.fb.group({
      location: ['', Validators.required],
      imageUrl: ['', Validators.required],
    });
  }

  getControl(controlName: string): FormControl {
    return this.sliderForm.get(controlName) as FormControl;
  }


  private loadLocations(): void {
    this.lookupService.getOptions('locations').subscribe({
      next: (data: ISelectOption[]) => {
        this.locations = data;


        if (this.isOpen && this.mode === 'edit') {
          this.patchEditForm();
        }
      },

      error: (error) => {
        console.error('Failed to load locations', error);
      },
    });
  }


  private handleModalOpen(): void {

    if (!this.sliderForm) {
      return;
    }

    if (this.mode === 'edit' && this.sliderData) {
      this.patchEditForm();
      return;
    }

    this.resetFormState();
  }

  private patchEditForm(): void {
    if (!this.sliderForm || !this.sliderData) {
      return;
    }

    const matchedLocation = this.locations.find(
      location =>
        location.option === this.sliderData?.displayLocation ||
        location.id === this.sliderData?.displayLocation
    );

    this.sliderForm.patchValue({
      location: matchedLocation?.id ?? this.sliderData.displayLocation,
      imageUrl: this.sliderData.imageUrl,
    });


    this.imageBase64 = null;
  }


  get modalTitle(): string {
    return this.mode === 'add'
      ? 'إضافة إعلان جديد'
      : 'تعديل بيانات الإعلان';
  }


  onImageSelected(base64Url: string | null): void {
    this.imageBase64 = base64Url;

    this.sliderForm.patchValue({
      imageUrl: base64Url || ''
    });
  }


  onSubmit(): void {
    if (this.sliderForm.invalid) {
      this.sliderForm.markAllAsTouched();
      return;
    }

    const locationId = this.getControl('location').value;

    const selectedLocation = this.locations.find(
      location => location.id === locationId
    );

    const payload: ISlider = {
      ...(this.sliderData ?? {} as ISlider),

      displayLocation:
        selectedLocation?.option ?? locationId,

      isActive:
        this.mode === 'add'
          ? true
          : this.sliderData?.isActive ?? true,

      date:
        this.mode === 'add'
          ? new Date().toISOString()
          : this.sliderData?.date ?? new Date().toISOString(),

      imageUrl:
        this.imageBase64 ??
        this.sliderData?.imageUrl ??
        '',
    };

    this.save.emit(payload);
  }


  private resetFormState(): void {
    if (!this.sliderForm) {
      return;
    }

    this.sliderForm.reset();


    this.imageBase64 = null;
  }


  onCancel(): void {
    this.resetFormState();

    this.close.emit();
  }
}