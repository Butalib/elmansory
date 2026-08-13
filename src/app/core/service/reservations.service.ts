import { Injectable } from '@angular/core';

import { GenericCrudService } from './data/generic-crud.service';
import { ApiDataService } from './data/api.data.service';
import { ReservationTableRow } from '../interface/IReservation';

@Injectable({
  providedIn: 'root',
})
export class Reservations extends GenericCrudService<ReservationTableRow> {
  constructor(apiService: ApiDataService) {
    super('reservations', apiService);
  }
}
