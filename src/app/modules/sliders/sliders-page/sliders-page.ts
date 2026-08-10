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
    (query) => this.sliderService.loadByQuery(query),
    (data, query) => this.filterSlidersLocally(data, query),
    'local',
  );
  // Modal State Management
  readonly isModalOpen = signal(false);
  readonly selectedSlider = signal<ISlider | null>(null);
  readonly modalMode = signal<'add' | 'edit'>('add');
  // 1. دالة مخصصة لفتح مودل الإضافة
  openModalForAdd(): void {
    this.modalMode.set('add');
    this.selectedSlider.set(null);
    this.isModalOpen.set(true);
  }

  // 2. دالة مخصصة لفتح مودل التعديل
  openModalForEdit(slider: ISlider): void {
    this.modalMode.set('edit');
    this.selectedSlider.set(slider);
    this.isModalOpen.set(true);
  }

  // 3. دالة مخصصة للإغلاق وتصفير الحالة
  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedSlider.set(null);
  }

  // 4. دالة استقبال الداتا بعد الحفظ من المودل (سنبني اللوجيك الخاص بها لاحقاً)

  onSaveSlider(data: any): void {
    if (this.modalMode() === 'add') {
      this.sliderService.add(data).subscribe({
        next: () => {
          this.toastr.success('تمت إضافة الإعلان بنجاح');
          this.closeModal();
          this.refreshTable();
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
            this.refreshTable();
          },
          error: () => this.toastr.error('حدث خطأ أثناء التعديل'),
        });
      }
    }
  }

  // -- 2. الحذف --
  onDelete(slider: ISlider): void {
    this.sliderService.delete(slider.id).subscribe({
      next: () => {
        this.toastr.success('تم الحذف بنجاح');
        this.refreshTable();
      },
      error: () => this.toastr.error('حدث خطأ أثناء الحذف'),
    });
  }

  // -- 3. التفعيل والإيقاف (Toggle) --
  onToggle(slider: ISlider, checked: boolean): void {
    // نعمل نسخة من الإعلان ونغير حالته
    const updatedSlider = { ...slider, isActive: checked };

    this.sliderService.update(slider.id, updatedSlider).subscribe({
      next: () => {
        this.toastr.success(checked ? 'تم تفعيل الإعلان' : 'تم إيقاف الإعلان');
        this.refreshTable();
      },
      error: () => {
        this.toastr.error('فشل تغيير الحالة');
        this.refreshTable(); // لتحديث الجدول ورجوع الزرار لحالته الأصلية لو فشل
      },
    });
  }

  // -- 4. تحديث الجدول برمجياً --
  private refreshTable(): void {
    const currentQuery = this.engine.queryState$.getValue();
    this.engine.patchQuery({ ...currentQuery });
  }
  ngOnInit(): void {}
  onSearch(searchTerm: string): void {
    console.log('UI Search Event:', searchTerm);
    this.engine.patchQuery({ q: searchTerm });
  }
  onSortChange(sortBy: string, order: 'asc' | 'desc'): void {
    this.engine.patchQuery({ _sort: sortBy, _order: order });
  }
  private filterSlidersLocally(data: ISlider[], query: IQueryEngine): ISlider[] {
    if (!query.q) return data;
    const term = query.q.toLowerCase();
    return data.filter(
      (slider) =>
        slider.title?.toLowerCase().includes(term) ||
        slider.displayLocation?.toLowerCase().includes(term),
    );
  }
}
