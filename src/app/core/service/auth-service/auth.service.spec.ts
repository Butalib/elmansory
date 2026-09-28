import { of } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from './auth.service';
import { ApiDataService } from '../data/api.data.service';
import { AuthSession } from '../../interface/iuser';

describe('AuthService', () => {
  const session: AuthSession = {
    accessToken: 'test-token',
    user: {
      id: 1,
      username: 'admin',
      name: 'Admin',
      email: 'admin@example.com',
      role: 'admin',
    },
  };
  let apiService: { post: ReturnType<typeof vi.fn> };
  let service: AuthService;

  beforeEach(() => {
    const values = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      clear: () => values.clear(),
      getItem: (key: string) => values.get(key) ?? null,
      removeItem: (key: string) => values.delete(key),
      setItem: (key: string, value: string) => values.set(key, value),
    });
    apiService = { post: vi.fn(() => of(session)) };
    service = new AuthService(apiService as unknown as ApiDataService);
  });

  afterEach(() => vi.unstubAllGlobals());

  it('logs in through the POST endpoint and stores the session data', async () => {
    await expect(
      firstValueFrom(service.login({ email: 'admin@example.com', password: 'secret' })),
    ).resolves.toBe(true);

    expect(service.isLoggedIn()).toBe(true);
    expect(service.getUsername()).toBe('Admin');
    expect(service.hasRole('admin')).toBe(true);
    expect(service.getAccessToken()).toBe('test-token');
    expect(apiService.post).toHaveBeenCalledWith('auth/login', {
      email: 'admin@example.com',
      password: 'secret',
    });
  });

  it('clears the persisted session only when logging out', () => {
    localStorage.setItem('auth_session', JSON.stringify(session));
    service.logout();

    expect(service.isLoggedIn()).toBe(false);
    expect(service.getUsername()).toBe('');
    expect(service.getAccessToken()).toBeNull();
  });

  it('uses the POST registration endpoint and creates a session', async () => {
    await expect(
      firstValueFrom(
        service.register({
          name: 'New Admin',
          email: 'new-admin@example.com',
          password: 'secret',
        }),
      ),
    ).resolves.toBe(true);

    expect(apiService.post).toHaveBeenCalledWith('auth/register', {
      name: 'New Admin',
      email: 'new-admin@example.com',
      password: 'secret',
    });
    expect(service.isLoggedIn()).toBe(true);
  });
});
