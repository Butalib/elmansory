import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ServerStatusService {
  private readonly http = inject(HttpClient);

  readonly isWakingUp = signal(false);

  warmup(): void {
    this.http.get(`${environment.apiUrl}/dashboard`).subscribe({
      next: () => {},
      error: () => {},
    });
  }
}
