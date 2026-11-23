import '@angular/compiler';
import { EnvironmentInjector, createEnvironmentInjector, runInInjectionContext } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ServerStatusService } from './server-status.service';
import { environment } from '../../../environments/environment';

describe('ServerStatusService', () => {
  let injector: EnvironmentInjector | undefined;

  afterEach(() => {
    injector?.destroy();
    injector = undefined;
    vi.restoreAllMocks();
  });

  it('should initialize with isWakingUp as false', () => {
    const mockHttp = { get: vi.fn(() => of({})) };
    injector = createEnvironmentInjector(
      [{ provide: HttpClient, useValue: mockHttp }],
      null,
    );

    const service = runInInjectionContext(injector, () => new ServerStatusService());
    expect(service.isWakingUp()).toBe(false);
  });

  it('should send a GET request to ${environment.apiUrl}/dashboard on warmup()', () => {
    const mockHttp = { get: vi.fn(() => of({ status: 'ok' })) };
    injector = createEnvironmentInjector(
      [{ provide: HttpClient, useValue: mockHttp }],
      null,
    );

    const service = runInInjectionContext(injector, () => new ServerStatusService());
    service.warmup();

    expect(mockHttp.get).toHaveBeenCalledWith(`${environment.apiUrl}/dashboard`);
  });

  it('should silently handle errors on warmup() without throwing', () => {
    const mockHttp = {
      get: vi.fn(() => throwError(() => new Error('Cold start network error'))),
    };
    injector = createEnvironmentInjector(
      [{ provide: HttpClient, useValue: mockHttp }],
      null,
    );

    const service = runInInjectionContext(injector, () => new ServerStatusService());
    expect(() => service.warmup()).not.toThrow();
    expect(service.isWakingUp()).toBe(false);
  });
});
