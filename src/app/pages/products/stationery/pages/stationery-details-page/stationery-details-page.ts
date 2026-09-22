import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IStationery } from '../../../../../core/interface/IStationery';
import { LayoutServices } from '../../../../../core/service/Layout.service';
import { StationeryService } from '../../../../../core/service/stationery.service';

@Component({
  selector: 'app-stationery-details-page',
  standalone: false,
  templateUrl: './stationery-details-page.html',
  styleUrl: './stationery-details-page.scss',
})
export class StationeryDetailsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly stationeryService = inject(StationeryService);
  private readonly layoutServices = inject(LayoutServices);
  private readonly toastr = inject(ToastrService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  product: IStationery | null = null;
  isLoading = true;
  hasLoadError = false;
  isDeleteConfirmOpen = false;
  isDeleting = false;

  ngOnInit(): void {
    this.layoutServices.pageTitle.set('تفاصيل المنتج');
    this.loadProduct();
  }

  editProduct(): void {
    if (!this.product) {
      return;
    }

    this.router.navigate(['/dashboard/layout/products/stationery/edit', this.product.id]);
  }

  requestDelete(): void {
    this.isDeleteConfirmOpen = true;
  }

  cancelDelete(): void {
    this.isDeleteConfirmOpen = false;
    this.isDeleting = false;
  }

  confirmDelete(): void {
    if (!this.product) {
      return;
    }

    this.isDeleting = true;
    this.stationeryService.delete(this.product.id).subscribe({
      next: () => {
        this.toastr.success('تم حذف المنتج بنجاح');
        this.isDeleting = false;
        this.isDeleteConfirmOpen = false;
        this.syncView();
        this.goBack();
      },
      error: () => {
        this.isDeleting = false;
        this.toastr.error('حدث خطأ أثناء حذف المنتج');
        this.syncView();
      },
    });
  }

  toggleActive(value: boolean): void {
    if (!this.product) {
      return;
    }

    const currentProduct = this.product;
    this.stationeryService.update(currentProduct.id, { isActive: value }).subscribe({
      next: () => {
        this.product = { ...currentProduct, isActive: value };
        this.toastr.success('تم تحديث حالة المنتج بنجاح');
        this.syncView();
      },
      error: () => {
        this.toastr.error('حدث خطأ أثناء تحديث الحالة');
        this.syncView();
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/layout/products/stationery']);
  }

  private loadProduct(): void {
    const productId = this.route.snapshot.paramMap.get('id');

    if (!productId) {
      this.isLoading = false;
      this.hasLoadError = true;
      this.syncView();
      return;
    }

    this.isLoading = true;
    this.hasLoadError = false;
    this.stationeryService.getById<IStationery>(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.isLoading = false;
        this.syncView();
      },
      error: () => {
        this.isLoading = false;
        this.hasLoadError = true;
        this.toastr.error('حدث خطأ أثناء تحميل تفاصيل المنتج');
        this.syncView();
      },
    });
  }

  private syncView(): void {
    queueMicrotask(() => {
      if (!this.destroyRef.destroyed) {
        this.cdr.detectChanges();
      }
    });
  }
}
