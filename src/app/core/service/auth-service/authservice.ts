import { Injectable } from '@angular/core';
import { IUser } from '../../interface/iuser';
import { map, Observable } from 'rxjs';
import { ApiDataService } from '../api-data';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apiService: ApiDataService) { }

  login(email: string, password: string) :Observable<boolean> {

    return this.apiService.get<IUser[]>('users')
      .pipe(
        map(users => {
          const user = users.find(
            u => u.email === email &&
              u.password === password
          );
          if (user) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', user.name);
            return true;
          }
          return false;
        })
      );

  }

  // logout
  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  checkEmail(email: string) : Observable<IUser | undefined> {
    return this.apiService.get<IUser[]>('users')
      .pipe(
        map(users => {
          const user = users.find(u => u.email === email);
          return user; 
        })
      );
  }
  getUsername(): string {
    return localStorage.getItem('username') || '';
}
}