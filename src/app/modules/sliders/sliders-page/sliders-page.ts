import { Component, OnInit, inject } from '@angular/core';
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
  onDelete(slider: ISlider): void { console.log(slider); }
  onEdit(slider: ISlider): void { console.log(slider); }
  onToggle(slider: ISlider, checked: boolean): void { console.log(slider, checked); }
}