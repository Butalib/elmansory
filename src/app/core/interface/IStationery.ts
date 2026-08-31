export type StationeryStatus = 'available' | 'unavailable' | 'lowStock';

export interface IStationeryVariant {
  id: string | number;
  color: string;
  size: string;
  price: number;
  quantity: number;
  isActive: boolean;
}

export interface IStationeryReview {
  id: string | number;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string | Date;
}

export interface IStationery {
  id: string | number;
  name: string;
  description?: string;
  categoryName?: string;
  imageUrl?: string;
  imageUrls?: string[];
  originalPrice: number;
  consumerPrice: number;
  discountPercentage?: number;
  quantity: number;
  status: StationeryStatus;
  isActive: boolean;
  isFeatured: boolean;
  isSchoolReady: boolean;
  variants?: IStationeryVariant[];
  reviews?: IStationeryReview[];
  createdAt: string | Date;
}
