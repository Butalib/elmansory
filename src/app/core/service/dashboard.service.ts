import { Injectable } from '@angular/core';
import { GenericCrudService } from './data/generic-crud.service';
import { ApiDataService } from './data/api.data.service';
import { IDashboard } from '../interface/IDashboard';

@Injectable({
  providedIn: 'root',
})
export class DashboardService extends GenericCrudService<IDashboard> {
  constructor(apiService: ApiDataService) {
    super('dashboard', apiService);
  }
}
