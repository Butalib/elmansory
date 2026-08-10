import { Injectable } from '@angular/core';
import { Observable, map, of, tap } from 'rxjs';
import { ApiDataService } from './data/api.data.service';
import { ISelectOption } from '../interface/ISelectOption';

@Injectable({
  providedIn: 'root'
})
export class LookupService {
  // كاش داخلي ذكي يحفظ البيانات بناءً على الـ Endpoint عشان منعملش Request مرتين لنفس الدروب داون
  private lookupCache = new Map<string, ISelectOption[]>();

  constructor(private apiService: ApiDataService) { }

  getOptions(endpoint: string, labelKey: string = 'name', valueKey: string = 'id'): Observable<ISelectOption[]> {
    // 1. التحقق من الذاكرة المؤقتة (Cache)
    if (this.lookupCache.has(endpoint)) {
      console.log(`[LookupService] Returning ${endpoint} from cache`);
      return of(this.lookupCache.get(endpoint)!);
    }

    // 2. إذا لم تكن في الكاش، نطلبها من الخادم
    return this.apiService.get<any[]>(endpoint, {}).pipe(
      map((rawData: any[]) => {
        // 3. (Adapter Pattern): تحويل البيانات الديناميكية إلى ISelectOption
        return rawData.map(item => ({
          id: item[valueKey], // قراءة الـ id ديناميكياً
          label: item[labelKey] || 'بدون اسم' // قراءة الـ label ديناميكياً
        }));
      }),
      tap((mappedData: ISelectOption[]) => {
        // 4. حفظ النتيجة النظيفة في الكاش للمرات القادمة
        this.lookupCache.set(endpoint, mappedData);
      })
    );
  }

  // دالة لمسح الكاش إذا تم إضافة تصنيف جديد مثلاً
  invalidateCache(endpoint: string): void {
    this.lookupCache.delete(endpoint);
  }
}