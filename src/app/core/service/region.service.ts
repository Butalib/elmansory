import { Injectable } from '@angular/core';
import { GenericCrudService } from './data/generic-crud.service';
import { ApiDataService } from './data/api.data.service';
import { IRegion } from '../interface/IRegion';

@Injectable({
  providedIn: 'root',
})
export class RegionService extends GenericCrudService<IRegion> {
  constructor(apiService: ApiDataService) {
    super('regions', apiService);
  }
}
