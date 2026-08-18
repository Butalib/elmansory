import { Injectable } from '@angular/core';
import { GenericCrudService } from './data/generic-crud.service';
import { ApiDataService } from './data/api.data.service';
import { ISubject } from '../interface/ISubject';

@Injectable({
  providedIn: 'root',
})
export class SubjectService extends GenericCrudService<ISubject> {
  constructor(apiService: ApiDataService) {
    super('subjects', apiService);
  }
}
