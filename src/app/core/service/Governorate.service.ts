import { Injectable } from '@angular/core';

import { GenericCrudService } from './data/generic-crud.service';
import { ApiDataService } from './data/api.data.service';
import { IGovernorate } from '../interface/IGovernorate';


@Injectable({
  providedIn: 'root',
})
export class GovernorateService extends GenericCrudService<IGovernorate> {
  constructor(apiService: ApiDataService) {
    super('governorates', apiService);
  }
}
