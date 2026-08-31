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
  getById<TResult = T>(id: string | number): Observable<TResult> {
    return this.apiService.get<TResult>(`${this.endpoint}/${id}`);
  }
  add(item: T): Observable<T> {
    return this.apiService.post<T>(this.endpoint, item).pipe(
      tap((newItem) => {

        const currentData = this.itemsSubject.getValue();
        this.itemsSubject.next([newItem, ...currentData]);
      })
    );
  }
  update(id: string | number, item: Partial<T>): Observable<T> {
    return this.apiService.put<T>(`${this.endpoint}/${id}`, item).pipe(
      tap((updatedItem) => {

        const currentData = this.itemsSubject.getValue();
        const index = currentData.findIndex((x: any) => x.id === id);

        if (index !== -1) {
          const newData = [...currentData];

          newData[index] = { ...newData[index], ...item, ...updatedItem };
          this.itemsSubject.next(newData);
        }
      })
    );
  }
  delete(id: string | number): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`).pipe(
      tap(() => {

        const currentData = this.itemsSubject.getValue();
        this.itemsSubject.next(currentData.filter((x: any) => x.id !== id));
      })
    );
  }
}