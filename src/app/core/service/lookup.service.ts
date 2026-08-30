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

  constructor(private apiService: ApiDataService) {}

  getOptions(
    endpoint: string,
    labelKey: string = 'name',
    valueKey: string = 'id',
  ): Observable<ISelectOption[]> {
    if (!this.lookupCache.has(endpoint)) {
      console.log(`[LookupService] Fetching and Caching ${endpoint}`);

      const request$ = this.apiService.get<any[]>(endpoint, {}).pipe(
        map((rawData: any[]) =>
          rawData.map((item) => ({
            id: item[valueKey],
            option: item[labelKey] || 'بدون اسم',
          })),
        ),
        shareReplay(1),
      );

      this.lookupCache.set(endpoint, request$);
    } else {
      console.log(`[LookupService] Returning ${endpoint} from cache`);
    }

    return this.lookupCache.get(endpoint)!;
  }

  invalidateCache(endpoint: string): void {
    this.lookupCache.delete(endpoint);
  }
}
