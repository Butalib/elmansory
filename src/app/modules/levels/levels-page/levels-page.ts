import { Component, inject, OnInit } from '@angular/core';
import { ITableColumn } from '../../../core/interface/IGenericTable';
import { ToastrService } from 'ngx-toastr';
import { LevelsService } from '../../../core/service/levels.service';
import { ILevels } from '../../../core/interface/ILevels';
import { HybridQueryEngine } from '../../../core/service/data/hybrid-query-engine.service';

@Component({
  selector: 'app-levels-page',
  standalone: false,
  templateUrl: './levels-page.html',
  styleUrl: './levels-page.scss',
})
export class LevelsPage implements OnInit {
  private toaster = inject(ToastrService);
  private levelsService = inject(LevelsService);

  // إعداد الأعمدة بناءً على مفاتيح ILevels
  tableColumns: ITableColumn[] = [
    { key: 'level', label: 'المرحلة الدراسية', type: 'text' },
    { key: 'subLevel', label: 'الصف الدراسي', type: 'text' },
    { key: 'isActive', label: 'اجراء', type: 'toggle' }, // استخدمنا isActive كـ key
  ];

  // إعداد الـ Engine زي ما عملت في الحجوزات
  readonly engine = new HybridQueryEngine<ILevels>(
    (query) => this.levelsService.loadByQuery(query),
    (data, query) => this.filterLocally(data, query),
    this.levelsService.items$,
    'local'
  );

  ngOnInit(): void {
    // تحميل البيانات لأول مرة
    this.levelsService.loadAll().subscribe();
  }

  onSearch(searchTerm: string): void {
    this.engine.patchQuery({ searchTerm });
  }

  // فلترة محلية لو الـ mode local
  private filterLocally(data: ILevels[], query: any): ILevels[] {
    if (!query.searchTerm) {
      return data;
    }
    const term = query.searchTerm.toLowerCase();
    return data.filter(level =>
      level.level?.toLowerCase().includes(term) ||
      level.subLevel?.toLowerCase().includes(term)
    );
  }

  onPageChange(newPage: number): void {
    // هنا بنقول للـ Engine: حدث حالة الـ Query بتاعتك برقم الصفحة الجديد
    // الـ Engine هيقوم بدوره بفلترة وقص الداتا (Local slice) وتحديث الـ result$
    this.engine.patchQuery({ _page: newPage });
  }
  // الدالة دي هتشتغل لما الجدول يبعت toggleChange
  onToggleChange(event: { key: string; row: ILevels; value: boolean }): void {
    const updatedLevel = { ...event.row, [event.key]: event.value };

    // نبعت الطلب للباك إند (عن طريق السيرفيس اللي وارثة من GenericCrud)
    // بنستخدم update عشان نغير حالة العنصر
    this.levelsService.update(event.row.id, updatedLevel).subscribe({
      next: () => {
        const status = event.value ? 'تفعيل' : 'إيقاف';
        this.toaster.success(`تم ${status} الصف الدراسي بنجاح`);
        // لو الـ GenericCrudService بتاعتك بتحدث الـ BehaviorSubject تلقائياً بعد الـ update،
        // فالجدول هيتحدث لوحده. لو لأ، هتحتاج تنادي this.levelsService.loadAll() تاني هنا.
      },
      error: (err) => {
        console.error('Error updating level status', err);
        this.toaster.error('حدث خطأ أثناء تعديل الحالة');
        // هنا ممكن نرجع الـ toggle لحالته القديمة في الـ UI لو حصل فشل (Rollback)
        this.levelsService.loadAll().subscribe();
      }
    });
  }
}
