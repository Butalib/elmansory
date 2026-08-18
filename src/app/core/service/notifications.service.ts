import { Injectable } from '@angular/core';
import { GenericCrudService } from './data/generic-crud.service';
import { ApiDataService } from './data/api.data.service';
import { INotifications } from '../interface/INotifications';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService extends GenericCrudService<INotifications> {
  constructor(apiService: ApiDataService) {
    super( 'notifications' , apiService);
  }
}
