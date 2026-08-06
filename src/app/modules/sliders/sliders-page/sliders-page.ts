import { Component, OnInit, inject, signal } from '@angular/core';
import { IQueryEngine } from '../../../core/interface/IQueryEngine';
import { SliderService } from '../../../core/service/slider.service';
import { ISlider } from '../../../core/interface/ISlider';
import { HybridQueryEngine } from '../../../core/service/data/hybrid-query-engine.service';

@Component({
  selector: 'app-sliders-page',
  standalone: false,
  templateUrl: './sliders-page.html',
  styleUrl: './sliders-page.scss'
})
export class SlidersPage implements OnInit {
  private sliderService = inject(SliderService);
  engine = new HybridQueryEngine<ISlider>(
    (query) => this.sliderService.loadByQuery(query),
    (data, query) => this.filterSlidersLocally(data, query),
    'local'
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
  onSaveSlider(data: ISlider): void {
    console.log('Data received from modal to be saved:', data);
    this.closeModal(); // إغلاق المودل مؤقتاً بعد الحفظ
  }

  // 5. تعديل دالة onEdit الموجودة عندك لتقوم بفتح المودل
  onEdit(slider: ISlider): void {
    console.log('Edit clicked for slider:', slider);
    this.openModalForEdit(slider);
  }

  ngOnInit(): void {
  }
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
    return data.filter(slider =>
      slider.title?.toLowerCase().includes(term) ||
      slider.displayLocation?.toLowerCase().includes(term)
    );
  }
  onDelete(slider: ISlider): void {
    console.log(slider);
  }

  onToggle(slider: ISlider, checked: boolean): void {
    console.log(slider, checked);
  }
}
