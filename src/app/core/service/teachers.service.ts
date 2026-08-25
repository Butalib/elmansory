import { Injectable } from '@angular/core';
import { GenericCrudService } from './data/generic-crud.service';
import { ApiDataService } from './data/api.data.service';
import { ITeacher } from '../interface/ITeacher';

@Injectable({
  providedIn: 'root',
})
export class Teachers extends GenericCrudService<ITeacher> {
  constructor(apiService: ApiDataService) {
    super('teachers', apiService);
  }
}

