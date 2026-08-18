import { Injectable } from '@angular/core';
import { GenericCrudService } from './data/generic-crud.service';
import { ApiDataService } from './data/api.data.service';
import { ILevels } from '../interface/ILevels';

@Injectable({
  providedIn: 'root',
})
export class LevelsService extends GenericCrudService<ILevels> {
  constructor(apiService: ApiDataService) {
    super('levels', apiService);
  }

}
