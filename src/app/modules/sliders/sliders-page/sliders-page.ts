import { Component, OnInit, inject, signal } from '@angular/core';
import { IQueryEngine } from '../../../core/interface/IQueryEngine';
import { SliderService } from '../../../core/service/slider/slider.service';
import { ISlider } from '../../../core/interface/ISlider';
import { HybridQueryEngine } from '../../../core/service/data/hybrid-query-engine.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sliders-page',
  standalone: false,
  templateUrl: './sliders-page.html',
  styleUrl: './sliders-page.scss',
})
export class SlidersPage implements OnInit {
  private sliderService = inject(SliderService);
  private toastr = inject(ToastrService);


  engine = new HybridQueryEngine<ISlider>(
    (query: IQueryEngine) => this.sliderService.loadByQuery(query),
    {
      mode: 'local',
      searchKeys: ['title', 'displayLocation']
    }
  );
  // Modal State Management
  readonly isModalOpen = signal(false);
  readonly selectedSlider = signal<ISlider | null>(null);
  readonly modalMode = signal<'add' | 'edit'>('add');
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

  onSaveSlider(data: any): void {
    if (this.modalMode() === 'add') {
      this.sliderService.add(data).subscribe({
        next: () => {
          this.toastr.success('تمت إضافة الإعلان بنجاح');
          this.closeModal();
          this.refreshSlyders();
          console.log('data add', data);
          console.log(this.engine.localDataCache$);
        },
        error: () => this.toastr.error('حدث خطأ أثناء الإضافة'),
      });
    } else {
      const id = this.selectedSlider()?.id;
      if (id) {
        this.sliderService.update(id, data).subscribe({
          next: () => {
            this.toastr.success('تم تعديل الإعلان بنجاح');
            this.closeModal();
            this.refreshSlyders();
            console.log('data edit', data);
            console.log('selectedSlider', this.selectedSlider()?.id);
            console.log('id', id);
            console.log(this.engine.localDataCache$?.subscribe({
              next: (data) => console.log('localDataCache$', data)
            }));
          },
          error: () => this.toastr.error('حدث خطأ أثناء التعديل'),
        });
      }
    }
  }
  onDelete(slider: ISlider): void {
    this.sliderService.delete(slider.id).subscribe({
      next: () => {
        this.toastr.success('تم الحذف بنجاح');
        this.refreshSlyders();
        console.log(this.engine.localDataCache$);

      },
      error: () => this.toastr.error('حدث خطأ أثناء الحذف'),
    });
  }
  onToggle(slider: ISlider, checked: boolean): void {
    // نعمل نسخة من الإعلان ونغير حالته
    const updatedSlider = { ...slider, isActive: checked };

    this.sliderService.update(slider.id, updatedSlider).subscribe({
      next: () => {
        this.toastr.success(checked ? 'تم تفعيل الإعلان' : 'تم إيقاف الإعلان');
        this.refreshSlyders();
      },
      error: () => {
        this.toastr.error('فشل تغيير الحالة');
        this.refreshSlyders(); // لتحديث الجدول ورجوع الزرار لحالته الأصلية لو فشل
      },
    });
  }
  private refreshSlyders(): void {
    this.engine.invalidateCache();
  }
  ngOnInit(): void { }
  onSearch(searchTerm: string): void {
    console.log('UI Search Event:', searchTerm);
    this.engine.patchQuery({ searchTerm: searchTerm });
  }
  onSortChange(sortBy: string, order: 'asc' | 'desc'): void {
    this.engine.patchQuery({ _sort: sortBy, _order: order });
  }
  private filterSlidersLocally(data: ISlider[], query: IQueryEngine): ISlider[] {
    if (!query.searchTerm) return data;
    const term = query.searchTerm.toLowerCase();
    return data.filter(
      (slider) =>
        slider.title?.toLowerCase().includes(term) ||
        slider.displayLocation?.toLowerCase().includes(term),
    );
  }
}
