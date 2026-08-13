import { Component, inject, OnInit } from '@angular/core';
import { ITableColumn } from '../../../core/interface/IGenericTable';
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

  tableColumns: ITableColumn[] = [
    { key: 'code', label: 'كود الطالب', type: 'text' },
    { key: 'studentName', label: 'اسم الطالب', type: 'text' },
    { key: 'governorate', label: 'المحافظة', type: 'text' },
    { key: 'region', label: 'المنطقة', type: 'text' },
    { key: 'phoneNumber', label: 'رقم الهاتف', type: 'text' },
    { key: 'teacherName', label: 'اسم المعلم', type: 'text' },
    { key: 'telegramLink', label: 'رابط التلجرام', type: 'text' },
  ];

  // الكومبوننت بيعمل الكونفيجريشن بس!
  engine = new HybridQueryEngine<ReservationTableRow>(
    (query) => this.reservationsService.loadByQuery(query),
    {
      mode: 'local',
      // بنقول للـ Engine ابحث في الأعمدة دي لو اليوزر كتب في السيرش
      searchKeys: ['code', 'studentName', 'governorate', 'region', 'phone', 'teacherName', 'telegramLink']
    }
  );

  currentPage: number = 1;

  ngOnInit(): void {
    // تحديد الحالة المبدئية للجدول
    this.engine.patchQuery({
      _page: this.currentPage,
      _limit: 10,
      _sort: 'createdAt',
      _order: 'desc'
    });
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.engine.patchQuery({ _page: newPage });
  }

  onSearch(searchTerm: string): void {
    // لما بنسيرش بنرجع للصفحة الأولى عشان النتائج تظهر صح
    this.engine.patchQuery({ searchTerm, _page: this.currentPage });
  }

  openModalForAdd(): void {
    console.log('Open add reservation modal');
  }

  openFilterModal(): void {
    console.log('Open reservation filter modal');
  }
}