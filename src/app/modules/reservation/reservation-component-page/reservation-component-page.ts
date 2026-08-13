import { Component, inject, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ITableColumn } from '../../../core/interface/IGenericTable';
import { IQueryEngine } from '../../../core/interface/IQueryEngine';
import { HybridQueryEngine } from '../../../core/service/data/hybrid-query-engine.service';
import { ReservationTableRow } from '../../../core/interface/IReservation';
import { Reservations } from '../../../core/service/reservations.service';

@Component({
  selector: 'app-reservation-component-page',
  standalone: false,
  templateUrl: './reservation-component-page.html',
  styleUrl: './reservation-component-page.scss',
})
export class ReservationComponentPage implements OnInit {
  private reservationsService = inject(Reservations);
  //config for the generic table component 
  tableColumns: ITableColumn[] = [
    { key: 'code', label: 'كود الطالب', type: 'text' },
    { key: 'studentName', label: 'اسم الطالب', type: 'text' },
    { key: 'governorate', label: 'المحافظة', type: 'text' },
    { key: 'region', label: 'المنطقة', type: 'text' },
    { key: 'phoneNumber', label: 'رقم الهاتف', type: 'text' },
    { key: 'teacherName', label: 'اسم المعلم', type: 'text' },
    { key: 'telegramLink', label: 'رابط التلجرام', type: 'text' },

  ];

  engine = new HybridQueryEngine<ReservationTableRow>(
    (query) => this.reservationsService.loadByQuery(query),
    (data, query) => this.filterReservationsLocally(data, query),
    'local',
  );
  ngOnInit(): void {
    this.engine.patchQuery({
      _sort: 'createdAt',
      _order: 'desc'
    });

    this.engine.data$.subscribe(data => {
      console.log('Reservations:', data);
      console.log('First reservation:', data[0]);
      console.log('Phone:', data[0]?.phone);
    });
  }



  onPageChange(newPage: number): void {
    this.engine.patchQuery({ _page: newPage });
  }

  openModalForAdd(): void {
    console.log('Open add reservation modal');
  }

  onSearch(searchTerm: string): void {
    this.engine.patchQuery({ searchTerm });
  }

  openFilterModal(): void {
    console.log('Open reservation filter modal');
  }


  private filterReservationsLocally(
    data: ReservationTableRow[],
    query: IQueryEngine,
  ): ReservationTableRow[] {
    let result = [...data];

    if (query.searchTerm) {
      const term = query.searchTerm.toLowerCase();
      result = result.filter(
        (reservation) =>
          reservation.code.toLowerCase().includes(term) ||
          reservation.studentName.toLowerCase().includes(term) ||
          reservation.governorate.toLowerCase().includes(term) ||
          reservation.region.toLowerCase().includes(term) ||
          reservation.phone.includes(term) ||
          reservation.teacherName.toLowerCase().includes(term) ||
          reservation.telegramLink.toLowerCase().includes(term)
      );
    }

    if (query._sort) {
      result.sort((a, b) => {
        const firstValue = String(a[query._sort as keyof ReservationTableRow] ?? '');
        const secondValue = String(b[query._sort as keyof ReservationTableRow] ?? '');
        const comparison = firstValue.localeCompare(secondValue);

        return query._order === 'desc' ? -comparison : comparison;
      });
    }

    return result;
  }
}
