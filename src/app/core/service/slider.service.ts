import { Injectable } from '@angular/core';

import { GenericCrudService } from './data/generic-crud.service';
import { ApiDataService } from './data/api.data.service';

import { ISlider } from '../interface/ISlider';
import { SliderDisplayLocation } from '../enum/SliderDisplayLocation';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SliderService extends GenericCrudService<ISlider> {
  constructor(apiService: ApiDataService) {
    super('sliders', apiService);
  }
  getActiveSliders(): Observable<ISlider[]> {
    return this.items$.pipe(
      map((sliders) => sliders.filter((slider) => slider.isActive))
    );
  }
  getSlidersByLocation(
    location: SliderDisplayLocation
  ): Observable<ISlider[]> {
    return this.items$.pipe(
      map((sliders) =>
        sliders.filter((slider) => slider.displayLocation === location)
      )
    );
  }
}
