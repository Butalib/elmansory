import { Injectable } from '@angular/core';
import { GenericCrudService } from './data/generic-crud.service';
import { ApiDataService } from './data/api.data.service';
import { IStationery } from '../interface/IStationery';

@Injectable({
  providedIn: 'root',
})
export class StationeryService extends GenericCrudService<IStationery> {
  constructor(apiService: ApiDataService) {
    super('stationery', apiService);
  }
}
