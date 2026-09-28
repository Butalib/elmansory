import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../service/auth-service/auth.service';

const canAccessAdmin = (): boolean | ReturnType<Router['createUrlTree']> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/auth/login']);
  }

  return authService.hasRole('admin') ? true : router.createUrlTree(['/auth/login']);
};

export const adminGuard: CanActivateFn & CanMatchFn = () => canAccessAdmin();
