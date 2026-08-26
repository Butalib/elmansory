import { Injectable } from '@angular/core';

import { GenericCrudService } from './data/generic-crud.service';
import { ApiDataService } from './data/api.data.service';
import { IProfits } from '../interface/IProfits';
@Injectable({
  providedIn: 'root',
})
export class ProfitsSrvices extends GenericCrudService<IProfits> {
  constructor(apiService: ApiDataService) {
    super('profits', apiService);
  }
}
