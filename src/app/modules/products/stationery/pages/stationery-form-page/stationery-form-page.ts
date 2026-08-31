import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IStationery } from '../../../../../core/interface/IStationery';
import { LayoutServices } from '../../../../../core/service/Layout.service';
import { StationeryService } from '../../../../../core/service/stationery.service';

@Component({
  selector: 'app-stationery-form-page',
  standalone: false,
  templateUrl: './stationery-form-page.html',
  styleUrl: './stationery-form-page.scss',
})
export class StationeryFormPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly stationeryService = inject(StationeryService);
  private readonly layoutServices = inject(LayoutServices);
  private readonly toastr = inject(ToastrService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  mode: 'add' | 'edit' = 'add';
  product: IStationery | null = null;
  isLoading = false;
  isSaving = false;
  hasLoadError = false;

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    this.mode = productId ? 'edit' : 'add';
    this.layoutServices.pageTitle.set(this.mode === 'add' ? 'إضافة منتج جديد' : 'تعديل تفاصيل المنتج');

    if (productId) {
      this.isLoading = true;
      this.hasLoadError = false;
      this.stationeryService
        .getById<IStationery>(productId)
        .subscribe({
          next: (product: IStationery) => {
            this.product = product;
            this.isLoading = false;
            this.syncView();
          },
          error: () => {
            this.isLoading = false;
            this.hasLoadError = true;
            this.toastr.error('حدث خطأ أثناء تحميل المنتج');
            this.syncView();
          },
        });
    }
  }

  onSave(product: IStationery): void {
    this.isSaving = true;

    const request$ = this.mode === 'add' ? this.stationeryService.add(product) : this.createUpdateRequest(product);

    if (!request$) {
      this.isSaving = false;
      this.toastr.error('تعذر تحديد المنتج المطلوب تعديله');
      this.syncView();
      return;
    }

    request$.subscribe({
      next: () => {
        this.toastr.success(this.mode === 'add' ? 'تمت إضافة المنتج بنجاح' : 'تم تعديل المنتج بنجاح');
        this.goBack();
      },
      error: () => {
        this.isSaving = false;
        this.toastr.error('حدث خطأ أثناء حفظ المنتج');
        this.syncView();
      },
    });
  }

  private createUpdateRequest(product: IStationery) {
    const productId = this.product?.id;
    return productId ? this.stationeryService.update(productId, product) : null;
  }

  goBack(): void {
    this.router.navigate(['/dashboard/layout/products/stationery']);
  }

  private syncView(): void {
    queueMicrotask(() => {
      if (!this.destroyRef.destroyed) {
        this.changeDetectorRef.detectChanges();
      }
    });
  }
}
