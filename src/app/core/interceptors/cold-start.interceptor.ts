import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { ServerStatusService } from '../services/server-status.service';

let activeSlowRequestCount = 0;

export const coldStartInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.includes('onrender.com')) {
    return next(request);
  }

  const serverStatus = inject(ServerStatusService);
  let didTrigger = false;

  const timer = setTimeout(() => {
    didTrigger = true;
    activeSlowRequestCount++;
    serverStatus.isWakingUp.set(true);
  }, 3000);

  return next(request).pipe(
    finalize(() => {
      clearTimeout(timer);
      if (didTrigger) {
        activeSlowRequestCount = Math.max(0, activeSlowRequestCount - 1);
        if (activeSlowRequestCount === 0) {
          serverStatus.isWakingUp.set(false);
        }
      }
    }),
  );
};
