import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { first, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiDataService {
  private readonly baseUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) { }
  get<T>(endpoint: string, queryParams?: any): Observable<T> {
    let params = new HttpParams();

    if (queryParams) {
      Object.keys(queryParams).forEach((key) => {
        const value = queryParams[key];
        if (value !== null && value !== undefined && value !== '') {
          params = params.append(key, value.toString());
        }
      });
    }
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, { params }).pipe(take(1));
  }
  // getAll<T[] >(endpoint: string): Observable<T[]>   {
  //   return this.http.get<T[]>(`${this.baseUrl}/${endpoint}`).pipe(take(1));
  // }
  post<T = any>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body).pipe(first());
  }

  put<T = any>(endpoint: string, body: any): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}/${endpoint}`, body).pipe(take(1));
  }

  delete<T = any>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`).pipe(take(1));
  }

}