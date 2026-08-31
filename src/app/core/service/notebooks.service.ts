import { Injectable } from '@angular/core';
import { GenericCrudService } from './data/generic-crud.service';
import { ApiDataService } from './data/api.data.service';
import { INotebook } from '../interface/INotebook';

@Injectable({
  providedIn: 'root',
})
export class NotebooksService extends GenericCrudService<INotebook> {
  constructor(apiService: ApiDataService) {
    super('notebooks', apiService);
  }
}
