import { Component, OnInit, inject, signal } from '@angular/core';

import { IQueryEngine } from '../../../core/interface/IQueryEngine';
import { ISlider } from '../../../core/interface/ISlider';

import { SliderService } from '../../../core/service/slider/slider.service';
import { HybridQueryEngine } from '../../../core/service/data/hybrid-query-engine.service';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sliders-page',
  standalone: false,
  templateUrl: './sliders-page.html',
  styleUrl: './sliders-page.scss',
})
export class SlidersPage implements OnInit {
  private readonly sliderService = inject(SliderService);
  private readonly toastr = inject(ToastrService);
  readonly engine = new HybridQueryEngine<ISlider>(
    (query: IQueryEngine) =>
      this.sliderService.loadByQuery(query),
    (data: ISlider[], query: IQueryEngine) =>
      this.filterSlidersLocally(data, query),
    this.sliderService.items$,
    'local'
  );
  readonly isModalOpen = signal(false);
  readonly selectedSlider =
    signal<ISlider | null>(null);
  readonly modalMode =
    signal<'add' | 'edit'>('add');

  ngOnInit(): void {
    this.sliderService.loadAll().subscribe();
  }
  openModalForAdd(): void {
    this.modalMode.set('add');
    this.selectedSlider.set(null);
    this.isModalOpen.set(true);
  }

  openModalForEdit(slider: ISlider): void {
    this.modalMode.set('edit');
    this.selectedSlider.set(slider);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedSlider.set(null);
  }
  onSaveSlider(data: ISlider): void {
    if (this.modalMode() === 'add') {
      this.sliderService.add(data).subscribe({
        next: () => {
          this.toastr.success(
            'تمت إضافة الإعلان بنجاح'
          );
          this.closeModal();
        },
        error: () => {
          this.toastr.error(
            'حدث خطأ أثناء الإضافة'
          );
        },
      });
      return;
    }
    const id = this.selectedSlider()?.id;
    if (!id) {
      return;
    }
    this.sliderService.update(id, data).subscribe({
      next: () => {
        this.toastr.success(
          'تم تعديل الإعلان بنجاح'
        );
        this.closeModal();
      },
      error: () => {
        this.toastr.error(
          'حدث خطأ أثناء التعديل'
        );
      },
    });
  }
  onDelete(slider: ISlider): void {
    this.sliderService.delete(slider.id).subscribe({
      next: () => {
        this.toastr.success('تم الحذف بنجاح');
      },
      error: () => {
        this.toastr.error('حدث خطأ أثناء الحذف');
      },
    });
  }
  onToggle(
    slider: ISlider,
    checked: boolean
  ): void {
    const updatedSlider: ISlider = {
      ...slider,
      isActive: checked,
    };
    this.sliderService
      .update(slider.id, updatedSlider)
      .subscribe({
        next: () => {
          this.toastr.success(checked ? 'تم تفعيل الإعلان' : 'تم إيقاف الإعلان');

        },

        error: () => {

          this.toastr.error(
            'فشل تغيير الحالة'
          );

        },

      });
  }
  onSearch(searchTerm: string): void {
    this.engine.patchQuery({
      searchTerm,
    });
  }

  onSortChange(
    sortBy: string,
    order: 'asc' | 'desc'
  ): void {
    this.engine.patchQuery({
      _sort: sortBy,
      _order: order,
    });
  }
  private filterSlidersLocally(
    data: ISlider[],
    query: IQueryEngine
  ): ISlider[] {
    if (!query.searchTerm) {
      return data;
    }
    const term =
      query.searchTerm.toLowerCase();
    return data.filter(slider => slider.title?.toLowerCase().includes(term) || slider.displayLocation?.toLowerCase().includes(term));
  }
}