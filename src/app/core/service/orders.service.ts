import { Injectable } from '@angular/core';
import { GenericCrudService } from './data/generic-crud.service';
import { ApiDataService } from './data/api.data.service';
import { IOrder, IOrderDetails } from '../interface/IOrder';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrdersService extends GenericCrudService<IOrder> {
  constructor(apiService: ApiDataService) {
    super('orders', apiService);
  }
  getOrderDetails(id: string | number): Observable<IOrderDetails> {
    return this.getById<IOrderDetails>(id);
  }
}
