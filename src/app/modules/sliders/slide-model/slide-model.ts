import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
// 1. استيراد أدوات الفورم
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ISlider } from '../../../core/interface/ISlider';

@Component({
  selector: 'app-slide-model',
  standalone: false,
  templateUrl: './slide-model.html',
  styleUrls: ['./slide-model.scss']
})
export class SlideModelComponent implements OnInit, OnChanges {
  @Input() isOpen: boolean = false;
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() sliderData: ISlider | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<ISlider>();

  // 2. تعريف الفورم جروب
  sliderForm!: FormGroup;

  // 3. حقن الـ FormBuilder (أداة بناء الفورم)
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    // 4. بناء هيكل الفورم مع الـ Validations
    this.sliderForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      imageUrl: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // 5. اللوجيك الذهبي: لو المودل اتفتح في وضع التعديل، والبيانات موجودة
    if (changes['isOpen'] && this.isOpen === true) {
      if (this.mode === 'edit' && this.sliderData) {
        // احقن البيانات في الفورم
        this.sliderForm.patchValue({
          title: this.sliderData.title,
          imageUrl: this.sliderData.imageUrl,
          location: this.sliderData.displayLocation
        });
      } else {
        // لو إضافة، نأكد إن الفورم فاضي ونظيف
        if (this.sliderForm) this.sliderForm.reset();
      }
    }
  }

  get modalTitle(): string {
    return this.mode === 'add' ? 'إضافة إعلان جديد' : 'تعديل بيانات الإعلان';
  }

  onSubmit(): void {
    // 6. منع الإرسال لو الفورم غير صالح
    if (this.sliderForm.invalid) {
      this.sliderForm.markAllAsTouched(); // إظهار رسائل الخطأ للمستخدم
      console.log('Form is invalid', this.sliderForm.errors);
      return;
    }

    // تجهيز الداتا للإرسال
    const formValue = this.sliderForm.value;

    // لو بنعدل، لازم نبعت الـ ID القديم مع الداتا الجديدة
    const dataToSave: ISlider = {
      ...(this.mode === 'edit' && this.sliderData ? { id: this.sliderData.id } : {}),
      ...formValue
    };

    console.log(`[SlideModel] Emitting ${this.mode} event`, dataToSave);
    this.save.emit(dataToSave);
  }

  onCancel(): void {
    this.close.emit();
  }
}