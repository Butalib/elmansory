import { Component, inject, OnInit } from '@angular/core';
import { ITableColumn } from '../../../core/interface/IGenericTable';
import { HybridQueryEngine } from '../../../core/service/data/hybrid-query-engine.service';
import { ReservationTableRow } from '../../../core/interface/IReservation';
import { Reservations } from '../../../core/service/reservations.service';
import { LookupService } from '../../../core/service/lookup.service';
import { ISelectOption } from '../../../core/interface/ISelectOption';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reservation-component-page',
  standalone: false,
  templateUrl: './reservation-component-page.html',
  styleUrl: './reservation-component-page.scss',
})
export class ReservationComponentPage implements OnInit {
  private readonly reservationsService = inject(Reservations);
  private readonly lookupService = inject(LookupService); // حقن السيرفيس
  private toaster = inject(ToastrService);
  tableColumns: ITableColumn[] = [
    { key: 'code', label: 'كود الطالب', type: 'text' },
    { key: 'studentName', label: 'اسم الطالب', type: 'text' },
    { key: 'governorate', label: 'المحافظة', type: 'text' },
    { key: 'region', label: 'المنطقة', type: 'text' },
    { key: 'phoneNumber', label: 'رقم الهاتف', type: 'text' },
    { key: 'teacherName', label: 'اسم المعلم', type: 'text' },
    { key: 'telegramLink', label: 'رابط التلجرام', type: 'text' },
  ];
  readonly engine = new HybridQueryEngine<ReservationTableRow>(
    (query) => this.reservationsService.loadByQuery(query),
    (data, query) => this.filterLocally(data, query),
    // 3. Source of Truth
    this.reservationsService.items$,
    // 4. Mode
    'local'
  );
  isModalOpen = false;
  teachersList: ISelectOption[] = [];
  subjectsList: ISelectOption[] = [];
  governoratesList: ISelectOption[] = [];
  regionsList: ISelectOption[] = []; // دي هتتغير حسب المحافظة

  closeModal(): void {
    this.isModalOpen = false;
  }
  openModal(): void {
    this.isModalOpen = true;
  }
  ngOnInit(): void {
    this.engine.patchQuery({ _sort: 'createdAt', _order: 'desc' });
    this.reservationsService.loadAll().subscribe();
    this.loadInitialLookups();
  }
  private loadInitialLookups(): void {
    this.lookupService.getOptions('teachers').subscribe(res => this.teachersList = res);
    this.lookupService.getOptions('subjects').subscribe(res => this.subjectsList = res);
    this.lookupService.getOptions('governorates').subscribe(res => this.governoratesList = res);
    console.log('Initial lookups loaded:', {
      teachers: this.teachersList.find(t => t.id === '1'), // Example check
      subjects: this.subjectsList,
      governorates: this.governoratesList
    });
  }
  handleGovernorateChange(govId: string | number): void {
    // اللوجيك السحري: لما المحافظة تتغير، بنجيب المناطق الخاصة بيها بس
    const endpoint = `regions?governorateId=${govId}`;
    this.lookupService.getOptions(endpoint).subscribe({
      next: (res) => {
        this.regionsList = res;
      },
      error: (err) => console.error('Failed to load regions', err)
    });
  }
  onSave(data: ReservationTableRow): void {
    // 1. الداتا اللي جاية هنا هي قيم الفورم (تحتوي على IDs وليس أسماء)
    // لاحظ إننا غيرنا data.teacherName لـ data.teacherId عشان تطابق الفورم
    const selectedTeacher = this.teachersList.find(t => String(t.id) === String(data.teacherId));
    const selectedSubject = this.subjectsList.find(s => String(s.id) === String(data.subjectId));
    const selectedGovernorate = this.governoratesList.find(g => String(g.id) === String(data.governorateId));
    const selectedRegion = this.regionsList.find(r => String(r.id) === String(data.regionId));

    // 2. بناء الـ DTO (Data Transfer Object) النهائي
    const payload = {
      ...data, // بيفك كل الداتا الأساسية زي اسم الطالب والتليفون

      // 3. بنزرع الأسماء الجديدة اللي الجدول منتظرها عشان يعرضها
      teacherName: selectedTeacher?.option ?? 'غير محدد',
      subject: selectedSubject?.option ?? 'غير محدد',
      governorate: selectedGovernorate?.option ?? 'غير محدد',
      region: selectedRegion?.option ?? 'غير محدد',

      // إضافة كود عشوائي لو الداتا بيز مش بتعمله أوتوماتيك (عشان الجدول ميبقاش فاضي)
      code: data.code || 'REQ' + Math.floor(Math.random() * 1000000)
    };

    console.log('Mapped Payload ready for backend:', payload);

    // 4. الإرسال للسيرفيس
    this.reservationsService.add(payload).subscribe({
      next: (res) => {
        this.toaster.success('تمت إضافة الحجز بنجاح');
        this.closeModal();
      },
      error: (err) => {
        console.error('Failed to save reservation', err);
        this.toaster.error('فشل في إضافة الحجز');
      }
    });
  }
  onPageChange(newPage: number): void {
    this.engine.patchQuery({ _page: newPage });
  }
  onSearch(searchTerm: string): void {
    this.engine.patchQuery({ searchTerm });
  }

  onSortChange(order: 'asc' | 'desc'): void {
    this.engine.patchQuery({ _sort: 'createdAt', _order: order });
  }

  onDateRangeChange(range: { startDate: string; endDate: string }): void {
    this.engine.patchQuery({ startDate: range.startDate, endDate: range.endDate });
  }

  private filterLocally(data: ReservationTableRow[], query: any): ReservationTableRow[] {
    let filteredData = data;

    if (query.searchTerm) {
      const term = query.searchTerm.toLowerCase();
      filteredData = filteredData.filter(reservation =>
        reservation.code?.toLowerCase().includes(term) ||
        reservation.studentName?.toLowerCase().includes(term) ||
        reservation.governorateId?.toLowerCase().includes(term) ||
        reservation.regionId?.toLowerCase().includes(term) ||
        reservation.phoneNumber?.includes(term) ||
        reservation.teacherId?.toLowerCase().includes(term)
      );
    }

    if (query.startDate && query.endDate) {
      filteredData = filteredData.filter((reservation) => {
        const reservationDate = reservation.createdAt.split('T')[0];

        return reservationDate >= query.startDate && reservationDate <= query.endDate;
      });
    }

    return filteredData;
  }
}
