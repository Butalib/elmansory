import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, NgZone, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IStationery, IStationeryVariant } from '../../../../../core/interface/IStationery';

@Component({
  selector: 'app-stationery-form',
  standalone: false,
  templateUrl: './stationery-form.html',
  styleUrl: './stationery-form.scss',
})
export class StationeryFormComponent implements OnInit, OnChanges {
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() product: IStationery | null = null;
  @Input() isSaving = false;

  @Output() save = new EventEmitter<IStationery>();
  @Output() cancel = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly ngZone = inject(NgZone);

  form!: FormGroup;
  imageUrls: string[] = [];
  variants: IStationeryVariant[] = [];
  selectedImageIndex = 0;
  isVariantModalOpen = false;
  selectedVariant: IStationeryVariant | null = null;
  activeVariantActionsId: string | number | null = null;
  variantActionsMenuPosition = { top: 0, left: 0 };

  @HostListener('document:click')
  closeVariantActions(): void {
    this.activeVariantActionsId = null;
  }

  ngOnInit(): void {
    this.initForm();
    this.patchForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['product'] || changes['mode']) && this.form) {
      this.patchForm();
    }
  }

  getControl(controlName: string): FormControl {
    return this.form.get(controlName) as FormControl;
  }

  get selectedImageUrl(): string | null {
    return this.imageUrls[this.selectedImageIndex] ?? null;
  }

  get colors(): string[] {
    return [...new Set(this.variants.map((variant) => variant.color).filter(Boolean))];
  }

  get sizes(): string[] {
    return [...new Set(this.variants.map((variant) => variant.size).filter(Boolean))];
  }

  onImageFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file || !file.type.startsWith('image/')) {
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        this.ngZone.run(() => this.addImage(reader.result as string));
      }
    };
    reader.readAsDataURL(file);
  }

  openImagePicker(event: Event, input: HTMLInputElement): void {
    event.stopPropagation();
    input.value = '';
    input.click();
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  removeImage(index: number, event: Event): void {
    event.stopPropagation();

    if (index < 0 || index >= this.imageUrls.length) {
      return;
    }

    this.imageUrls = this.imageUrls.filter((_, imageIndex) => imageIndex !== index);

    if (this.imageUrls.length === 0) {
      this.selectedImageIndex = 0;
    } else if (this.selectedImageIndex === index) {
      this.selectedImageIndex = Math.min(index, this.imageUrls.length - 1);
    } else if (this.selectedImageIndex > index) {
      this.selectedImageIndex -= 1;
    }

    this.changeDetectorRef.detectChanges();
  }

  openAddVariant(): void {
    this.selectedVariant = null;
    this.isVariantModalOpen = true;
  }

  openEditVariant(variant: IStationeryVariant): void {
    this.activeVariantActionsId = null;
    this.selectedVariant = variant;
    this.isVariantModalOpen = true;
  }

  closeVariantModal(): void {
    this.isVariantModalOpen = false;
    this.selectedVariant = null;
  }

  saveVariant(variant: IStationeryVariant): void {
    const index = this.variants.findIndex((item) => item.id === variant.id);

    this.variants =
      index === -1
        ? [...this.variants, variant]
        : this.variants.map((item) => (item.id === variant.id ? variant : item));

    this.closeVariantModal();
  }

  removeVariant(variant: IStationeryVariant): void {
    this.activeVariantActionsId = null;
    this.variants = this.variants.filter((item) => item.id !== variant.id);
  }

  toggleVariantActions(variant: IStationeryVariant, event: MouseEvent): void {
    event.stopPropagation();

    if (this.activeVariantActionsId === variant.id) {
      this.activeVariantActionsId = null;
      return;
    }

    const trigger = event.currentTarget as HTMLElement;
    const rect = trigger.getBoundingClientRect();
    const menuWidth = 136;
    const menuHeight = 92;
    const gap = 6;
    const viewportMargin = 8;

    const preferredTop = rect.top - menuHeight - gap;
    const fallbackTop = rect.bottom + gap;
    const top = preferredTop >= viewportMargin ? preferredTop : fallbackTop;
    const left = rect.left + rect.width / 2 - menuWidth / 2;

    this.variantActionsMenuPosition = {
      top: Math.min(Math.max(top, viewportMargin), window.innerHeight - menuHeight - viewportMargin),
      left: Math.min(Math.max(left, viewportMargin), window.innerWidth - menuWidth - viewportMargin),
    };

    this.activeVariantActionsId = variant.id;
  }

  toggleVariant(variant: IStationeryVariant, isActive: boolean): void {
    this.variants = this.variants.map((item) => (item.id === variant.id ? { ...item, isActive } : item));
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
    const variantsQuantity = this.variants.reduce((sum, variant) => sum + Number(variant.quantity || 0), 0);
    const quantity = variantsQuantity || Number(value.quantity);

    this.save.emit({
      ...(this.product ?? ({} as IStationery)),
      name: value.name,
      description: value.description,
      categoryName: value.categoryName || 'منتجات',
      imageUrl: this.imageUrls[0] ?? '',
      imageUrls: this.imageUrls,
      originalPrice: Number(value.originalPrice),
      consumerPrice: Number(value.consumerPrice),
      discountPercentage: value.discountPercentage ? Number(value.discountPercentage) : 0,
      quantity,
      status: quantity <= 0 ? 'unavailable' : quantity <= 60 ? 'lowStock' : 'available',
      isActive: value.isActive,
      isFeatured: value.isFeatured,
      isSchoolReady: value.isSchoolReady,
      variants: this.variants,
      reviews: this.product?.reviews ?? [],
      createdAt: this.product?.createdAt ?? new Date().toISOString(),
    });
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      categoryName: ['منتجات'],
      originalPrice: [null, [Validators.required, Validators.min(0)]],
      consumerPrice: [null, [Validators.required, Validators.min(0)]],
      discountPercentage: [null, Validators.min(0)],
      quantity: [null, [Validators.required, Validators.min(0)]],
      isFeatured: [false],
      isSchoolReady: [false],
      isActive: [true],
    });
  }

  private patchForm(): void {
    if (!this.form) {
      return;
    }

    if (!this.product || this.mode === 'add') {
      this.form.reset({
        name: '',
        description: '',
        categoryName: 'منتجات',
        originalPrice: null,
        consumerPrice: null,
        discountPercentage: null,
        quantity: null,
        isFeatured: false,
        isSchoolReady: false,
        isActive: true,
      });
      this.imageUrls = [];
      this.variants = [];
      this.selectedImageIndex = 0;
      return;
    }

    this.imageUrls = this.product.imageUrls?.length
      ? [...this.product.imageUrls]
      : this.product.imageUrl
        ? [this.product.imageUrl]
        : [];
    this.variants = this.product.variants ? [...this.product.variants] : [];
    this.selectedImageIndex = 0;

    this.form.patchValue({
      name: this.product.name,
      description: this.product.description ?? '',
      categoryName: this.product.categoryName ?? 'منتجات',
      originalPrice: this.product.originalPrice,
      consumerPrice: this.product.consumerPrice,
      discountPercentage: this.product.discountPercentage ?? null,
      quantity: this.product.quantity,
      isFeatured: this.product.isFeatured ?? false,
      isSchoolReady: this.product.isSchoolReady ?? false,
      isActive: this.product.isActive ?? true,
    });
  }

  private addImage(imageUrl: string): void {
    this.imageUrls = [...this.imageUrls, imageUrl];
    this.selectedImageIndex = this.imageUrls.length - 1;
    this.changeDetectorRef.detectChanges();
  }
}
