import { BehaviorSubject, tap, Observable } from 'rxjs';
import { ApiDataService } from './api.data.service';
import { of } from 'rxjs';
export abstract class GenericCrudService<T extends { id: string | number }> {
  //cache source of truth 
  protected cacheSubject = new BehaviorSubject<T[]>([]);
  public items$ = this.cacheSubject.asObservable();
  constructor(
    protected endpoint: string,
    private apiService: ApiDataService
  ) { }
  loadAll(): Observable<T[]> {
    const currentData = this.cacheSubject.getValue();
    if (currentData && currentData.length > 0) {
      return of(currentData);
    }
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
  delete(id: string | number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`).pipe(
      tap(() => {
        const currentData = this.cacheSubject.getValue() || [];
        const filteredList = currentData.filter((t) => t.id !== id);
        this.cacheSubject.next(filteredList);
      })
    );
  }
}