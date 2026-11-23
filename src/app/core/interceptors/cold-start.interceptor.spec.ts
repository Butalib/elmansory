import '@angular/compiler';
import { EnvironmentInjector, createEnvironmentInjector, runInInjectionContext, signal } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Subject, of } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ServerStatusService } from '../services/server-status.service';
import { coldStartInterceptor } from './cold-start.interceptor';

describe('coldStartInterceptor', () => {
  let injector: EnvironmentInjector | undefined;
  let serverStatusMock: { isWakingUp: ReturnType<typeof signal<boolean>> };

  beforeEach(() => {
    vi.useFakeTimers();
    serverStatusMock = {
      isWakingUp: signal(false),
    };

    injector = createEnvironmentInjector(
      [{ provide: ServerStatusService, useValue: serverStatusMock }],
      null,
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    injector?.destroy();
    injector = undefined;
    vi.restoreAllMocks();
  });

  it('ignores requests not targeting onrender.com', () => {
    const req = new HttpRequest('GET', 'https://api.otherdomain.com/items');
    const next = vi.fn(() => of({}));

    runInInjectionContext(injector!, () => {
      coldStartInterceptor(req, next as any);
    });

    vi.advanceTimersByTime(3500);
    expect(serverStatusMock.isWakingUp()).toBe(false);
    expect(next).toHaveBeenCalledWith(req);
  });

  it('does not trigger isWakingUp for fast onrender.com requests (< 3s)', () => {
    const req = new HttpRequest('GET', 'https://elmansory.onrender.com/items');
    const responseSubject = new Subject();
    const next = vi.fn(() => responseSubject.asObservable());

    runInInjectionContext(injector!, () => {
      coldStartInterceptor(req, next as any).subscribe();
    });

    // Advance 2s and complete request
    vi.advanceTimersByTime(2000);
    expect(serverStatusMock.isWakingUp()).toBe(false);

    responseSubject.next({});
    responseSubject.complete();

    // Advance past 3s
    vi.advanceTimersByTime(2000);
    expect(serverStatusMock.isWakingUp()).toBe(false);
  });

  it('triggers isWakingUp when request takes longer than 3 seconds, and resets after completion', () => {
    const req = new HttpRequest('GET', 'https://elmansory.onrender.com/dashboard');
    const responseSubject = new Subject();
    const next = vi.fn(() => responseSubject.asObservable());

    runInInjectionContext(injector!, () => {
      coldStartInterceptor(req, next as any).subscribe();
    });

    vi.advanceTimersByTime(2999);
    expect(serverStatusMock.isWakingUp()).toBe(false);

    vi.advanceTimersByTime(1);
    expect(serverStatusMock.isWakingUp()).toBe(true);

    // Complete request
    responseSubject.next({});
    responseSubject.complete();

    expect(serverStatusMock.isWakingUp()).toBe(false);
  });
});
