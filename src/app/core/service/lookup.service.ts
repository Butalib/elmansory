import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators'; // ضفنا shareReplay
import { ApiDataService } from './data/api.data.service';
import { ISelectOption } from '../interface/ISelectOption';

@Injectable({
  providedIn: 'root',
})
export class LookupService {
  private lookupCache = new Map<string, Observable<ISelectOption[]>>();

  constructor(private apiService: ApiDataService) { }

  getOptions(
    endpoint: string,
    labelKey: string = 'name',
    valueKey: string = 'id',
    queryParams?: Record<string, string | number | boolean | null | undefined>,
  ): Observable<ISelectOption[]> {
    const cacheKey = this.createCacheKey(endpoint, queryParams);

    if (!this.lookupCache.has(cacheKey)) {

      const request$ = this.apiService.get<any[]>(endpoint, queryParams).pipe(
        map((rawData: any[]) =>
          rawData.map((item) => ({
            id: item[valueKey],
            option: item[labelKey] || 'بدون اسم',
          })),
        ),
        shareReplay(1),
      );

      this.lookupCache.set(cacheKey, request$);
    } else {
      console.log(`[LookupService] Returning ${cacheKey} from cache`);
    }

    return this.lookupCache.get(cacheKey)!;
  }

  invalidateCache(endpoint: string): void {
    this.lookupCache.delete(endpoint);
  }

  private createCacheKey(
    endpoint: string,
    queryParams?: Record<string, string | number | boolean | null | undefined>,
  ): string {
    if (!queryParams) {
      return endpoint;
    }

    const params = Object.entries(queryParams)
      .filter(([, value]) => value !== null && value !== undefined && value !== '')
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, value]) => `${key}=${String(value)}`)
      .join('&');

    return params ? `${endpoint}?${params}` : endpoint;
  }
}
