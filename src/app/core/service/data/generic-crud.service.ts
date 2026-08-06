import { tap, Observable, of } from 'rxjs';
import { ApiDataService } from './api.data.service';
import { IQueryEngine } from '../../interface/IQueryEngine';

export abstract class GenericCrudService<T extends { id: string | number }> {

  protected queryCache = new Map<string, T[]>();

  constructor(
    protected endpoint: string,
    private apiService: ApiDataService
  ) { }

  loadByQuery(query: IQueryEngine): Observable<T[]> {
    const queryKey = JSON.stringify(query);

    if (this.queryCache.has(queryKey)) {
      console.log(' Data loaded from Cache for query:', query);
      return of(this.queryCache.get(queryKey)!);
    }

    return this.apiService.get<T[]>(this.endpoint, query).pipe(
      tap((data: T[]) => {
        this.queryCache.set(queryKey, data);
        console.log(' Data loaded from Server and cached.');
      })
    );
  }

  add(item: T): Observable<T> {
    return this.apiService.post<T>(this.endpoint, item).pipe(
      tap(() => this.invalidateCache())
    );
  }

  update(item: T): Observable<T> {
    return this.apiService.put<T>(`${this.endpoint}/${item.id}`, item).pipe(
      tap(() => this.invalidateCache())
    );
  }

  delete(id: string | number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`).pipe(
      tap(() => this.invalidateCache())
    );
  }
  protected invalidateCache(): void {
    console.log('Cache Invalidated due to data mutation.');
    this.queryCache.clear();
  }
}