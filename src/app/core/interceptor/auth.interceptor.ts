import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth-service/auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  if (request.url.includes('/auth/login') || request.url.includes('/auth/register')) {
    return next(request);
  }

  const accessToken = inject(AuthService).getAccessToken();
  const authenticatedRequest = accessToken
    ? request.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
    : request;

  return next(authenticatedRequest);
};
