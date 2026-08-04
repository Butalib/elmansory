import { BehaviorSubject, tap, Observable } from 'rxjs';
import { ApiDataService } from './api.data.service'; // ظبط المسار

export abstract class GenericCrudService<T extends { id: string | number }> {

  //cache source of truth 
  protected cacheSubject = new BehaviorSubject<T[]>([]);
  public items$ = this.cacheSubject.asObservable();
  constructor(
    protected endpoint: string,
    private apiService: ApiDataService
  ) { }
  loadAll(): Observable<T[]> {
    return this.apiService.get<T[]>(this.endpoint).pipe(
      tap((data: T[]) => this.cacheSubject.next(data))
    );
  }
  add(item: T): Observable<T> {
    return this.apiService.post<T>(this.endpoint, item).pipe(
      tap((newItem: T) => {
        const currentData = this.cacheSubject.getValue() || [];
        this.cacheSubject.next([...currentData, newItem]);
      })
    );
  }
  update(item: T): Observable<T> {
    // استخدمنا item.id بأمان لأننا عاملين Constraint
    return this.apiService.put<T>(`${this.endpoint}/${item.id}`, item).pipe(
      tap((updatedItem: T) => {
        const currentData = this.cacheSubject.getValue() || [];
        const updatedList = currentData.map((t) =>
          t.id === updatedItem.id ? updatedItem : t
        );
        this.cacheSubject.next(updatedList);
      })
    );
  }
  delete(id: string | number): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`).pipe(
      tap(() => {
        const currentData = this.cacheSubject.getValue() || [];
        const filteredList = currentData.filter((t) => t.id !== id);
        this.cacheSubject.next(filteredList);
      })
    );
  }
}