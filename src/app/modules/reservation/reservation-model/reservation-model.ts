import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ISelectOption } from '../../../core/interface/ISelectOption';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reservation-model',
  standalone: false,
  templateUrl: './reservation-model.html',
  styleUrl: './reservation-model.scss',
})
export class ReservationModel implements OnInit, OnChanges {
  private readonly fb = inject(FormBuilder);

  @Input() isOpen = false;
  @Input() teachers: ISelectOption[] = [];
  @Input() subjects: ISelectOption[] = [];
  @Input() governorates: ISelectOption[] = [];
  @Input() regions: ISelectOption[] = [];




  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  @Output() governorateChanged = new EventEmitter<string | number>(); // الحدث اللي بيبلغ الأب بتغيير المحافظة
  reservationForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.setupDependencies();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && !this.isOpen && this.reservationForm) {
      this.reservationForm.reset(); // تصفير الفورم لما المودال يقفل
      this.getControl('regionId').disable(); // قفل المنطقة تاني
    }
  }
  private initForm(): void {
    this.reservationForm = this.fb.group({
      studentName: ['', Validators.required],
      teacherId: [null, Validators.required],
      subjectId: [null, Validators.required],
      governorateId: [null, Validators.required],
      regionId: [{ value: null, disabled: true }, Validators.required], // مقفول ديفولت
      address: ['', Validators.required],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern('^01[0125][0-9]{8}$')]], telegramLink: ['', Validators.required]
    });
  }
  private setupDependencies(): void {
    // نراقب حقل المحافظة
    this.getControl('governorateId').valueChanges.subscribe(govId => {
      const regionControl = this.getControl('regionId');
      // دايماً بنفضي المنطقة القديمة لو المحافظة اتغيرت
      regionControl.setValue(null);
      regionControl.markAsUntouched();
      if (govId) {
        regionControl.enable(); // نفتح الحقل للمستخدم
        this.governorateChanged.emit(govId); // ننده على الأب يروح يجيب الداتا
      } else {
        regionControl.disable(); // نقفل الحقل لو مسح المحافظة
      }
    });
  }
  getControl(controlName: string): FormControl {
    return this.reservationForm.get(controlName) as FormControl;
  }
  onCancel(): void {
    this.close.emit();
  }
  onSubmit(): void {
    if (this.reservationForm.invalid) {
      this.reservationForm.markAllAsTouched();
      return;
    }
    this.save.emit(this.reservationForm.getRawValue());
  }
  onClose(): void {
    this.close.emit();
  }
}