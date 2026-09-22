import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {
  IStationery,
  IStationeryReview,
  IStationeryVariant,
} from '../../../../../core/interface/IStationery';

@Component({
  selector: 'app-stationery-details',
  standalone: false,
  templateUrl: './stationery-details.html',
  styleUrl: './stationery-details.scss',
})
export class StationeryDetailsComponent implements OnChanges {
  @Input({ required: true }) product!: IStationery;

  @Output() edit = new EventEmitter<void>();
  @Output() deleteProduct = new EventEmitter<void>();
  @Output() toggleActive = new EventEmitter<boolean>();
  @Output() back = new EventEmitter<void>();

  readonly fallbackImage = 'assets/img/dashbourd/avatar.jpg';
  selectedImageIndex = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product']) {
      this.selectedImageIndex = 0;
    }
  }

  get galleryImages(): string[] {
    const images = this.product.imageUrls?.length
      ? this.product.imageUrls
      : this.product.imageUrl
        ? [this.product.imageUrl]
        : [];

    return images.length ? images : [this.fallbackImage];
  }

  get selectedImage(): string {
    return this.galleryImages[this.selectedImageIndex] ?? this.galleryImages[0];
  }

  get variants(): IStationeryVariant[] {
    return this.product.variants ?? [];
  }

  get colors(): string[] {
    return [...new Set(this.variants.map((variant) => variant.color).filter(Boolean))];
  }

  get sizes(): string[] {
    return [...new Set(this.variants.map((variant) => variant.size).filter(Boolean))];
  }

  get reviews(): IStationeryReview[] {
    return this.product.reviews ?? [];
  }

  get averageRating(): number {
    if (!this.reviews.length) {
      return 0;
    }

    const total = this.reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
    return Math.round((total / this.reviews.length) * 10) / 10;
  }

  get ratingRows(): { rating: number; count: number; percentage: number }[] {
    const total = this.reviews.length || 1;

    return [5, 4, 3, 2, 1].map((rating) => {
      const count = this.reviews.filter((review) => Math.round(review.rating) === rating).length;
      return {
        rating,
        count,
        percentage: (count / total) * 100,
      };
    });
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  formatPrice(value: number): string {
    return `${new Intl.NumberFormat('en-US').format(value).replace(/,/g, '.')} د.ع`;
  }

  colorValue(color: string): string {
    const normalizedColor = color.trim();
    const colors: Record<string, string> = {
      احمر: 'var(--color-product-red)',
      أحمر: 'var(--color-product-red)',
      red: 'var(--color-product-red)',
      اخضر: 'var(--color-product-green)',
      أخضر: 'var(--color-product-green)',
      green: 'var(--color-product-green)',
      اصفر: 'var(--color-product-yellow)',
      أصفر: 'var(--color-product-yellow)',
      yellow: 'var(--color-product-yellow)',
      رمادي: 'var(--color-product-gray)',
      gray: 'var(--color-product-gray)',
      grey: 'var(--color-product-gray)',
      ازرق: 'var(--color-product-blue)',
      أزرق: 'var(--color-product-blue)',
      blue: 'var(--color-product-blue)',
    };

    return colors[normalizedColor] ?? 'var(--color-primary-100)';
  }

  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement;

    if (!image || image.dataset['failed']) {
      return;
    }

    image.dataset['failed'] = 'true';
    image.src = this.fallbackImage;
  }
}
