import { Injectable } from '@angular/core';
import { GenericCrudService } from './data/generic-crud.service';
import { ApiDataService } from './data/api.data.service';
import { IStudent } from '../interface/IStudent';

@Injectable({
  providedIn: 'root',
})
export class StudentsService extends GenericCrudService<IStudent> {
  constructor(apiService: ApiDataService) {
    super('students', apiService);
  }
}
