import { Injectable } from '@angular/core';

import { GenericCrudService } from './data/generic-crud.service';
import { ApiDataService } from './data/api.data.service';

import { ISlider } from '../interface/ISlider';

@Injectable({
  providedIn: 'root',
})
export class SliderService extends GenericCrudService<ISlider> {
  constructor(apiService: ApiDataService) {
    super('sliders', apiService);
  }

}
