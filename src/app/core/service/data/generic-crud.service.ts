import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiDataService } from './api.data.service';

export class GenericCrudService<T> {
  private itemsSubject = new BehaviorSubject<T[]>([]);
  public items$ = this.itemsSubject.asObservable();
  constructor(
    protected endpoint: string,
    protected apiService: ApiDataService
  ) { }

  loadAll(queryParams?: any): Observable<T[]> {
    return this.apiService.get<T[]>(this.endpoint, queryParams).pipe(
      tap((data) => {
        this.itemsSubject.next(data);
      })
    );
  }
  loadByQuery(query: any): Observable<T[]> {
    return this.apiService.get<T[]>(this.endpoint, query);
  }
  add(item: T): Observable<T> {
    return this.apiService.post<T>(this.endpoint, item).pipe(
      tap((newItem) => {
        // Optimistic Update: بنضيف العنصر الجديد للستيت مباشرة
        const currentData = this.itemsSubject.getValue();
        this.itemsSubject.next([newItem, ...currentData]);
      })
    );
  }
  update(id: string | number, item: Partial<T>): Observable<T> {
    return this.apiService.put<T>(`${this.endpoint}/${id}`, item).pipe(
      tap((updatedItem) => {
        // بنعدل العنصر في الميموري عشان الـ UI يحس بالتغيير وقتي
        const currentData = this.itemsSubject.getValue();
        const index = currentData.findIndex((x: any) => x.id === id);

        if (index !== -1) {
          const newData = [...currentData];
          // لو الباك إند بيرجع الأوبجيكت متعدل بناخده، لو لأ بندمج التعديل مع القديم
          newData[index] = { ...newData[index], ...item, ...updatedItem };
          this.itemsSubject.next(newData);
        }
      })
    );
  }
  delete(id: string | number): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`).pipe(
      tap(() => {
        // بنفلتر الداتا ونشيل العنصر اللي اتمسح
        const currentData = this.itemsSubject.getValue();
        this.itemsSubject.next(currentData.filter((x: any) => x.id !== id));
      })
    );
  }
}