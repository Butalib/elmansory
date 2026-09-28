import { Injectable } from '@angular/core';
import { AuthSession, LoginRequest, RegisterRequest, UserRole } from '../../interface/iuser';
import { map, Observable, tap } from 'rxjs';
import { ApiDataService } from '../data/api.data.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly sessionStorageKey = 'auth_session';

  constructor(private apiService: ApiDataService) {}

  login(request: LoginRequest): Observable<boolean> {
    return this.apiService.post<AuthSession>('auth/login', request).pipe(
      tap((session) => this.saveSession(session)),
      map(() => true),
    );
  }

  register(request: RegisterRequest): Observable<boolean> {
    return this.apiService.post<AuthSession>('auth/register', request).pipe(
      tap((session) => this.saveSession(session)),
      map(() => true),
    );
  }

  logout(): void {
    localStorage.removeItem(this.sessionStorageKey);
  }

  isLoggedIn(): boolean {
    return this.getSession() !== null;
  }

  hasRole(role: UserRole): boolean {
    return this.getSession()?.user.role === role;
  }

  getUsername(): string {
    return this.getSession()?.user.name ?? '';
  }

  getAccessToken(): string | null {
    return this.getSession()?.accessToken ?? null;
  }

  private saveSession(session: AuthSession): void {
    if (!session.accessToken || !session.user?.role) {
      throw new Error('The authentication response is missing required session data.');
    }

    localStorage.setItem(this.sessionStorageKey, JSON.stringify(session));
  }

  private getSession(): AuthSession | null {
    const storedSession = localStorage.getItem(this.sessionStorageKey);
    if (!storedSession) {
      return null;
    }

    try {
      const session = JSON.parse(storedSession) as AuthSession;
      return session.accessToken && session.user?.role ? session : null;
    } catch {
      localStorage.removeItem(this.sessionStorageKey);
      return null;
    }
  }
}
