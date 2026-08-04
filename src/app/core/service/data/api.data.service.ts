import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiDataService {
  private readonly baseUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  get<T = any>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`). pipe(take(1));
  }

  post<T = any>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body). pipe(first());
  }

  put<T = any>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body). pipe(take(1));
  }

  delete<T = any>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`). pipe(take(1));
  }

}
