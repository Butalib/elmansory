import { of } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from './auth.service';
import { ApiDataService } from '../data/api.data.service';
import { IUser } from '../../interface/iuser';

describe('AuthService', () => {
    const users: IUser[] = [
        { id: 1, name: 'Admin', email: 'admin@example.com', password: 'secret' },
    ];
    let apiService: { get: ReturnType<typeof vi.fn> };
    let service: AuthService;

    beforeEach(() => {
        const values = new Map<string, string>();
        vi.stubGlobal('localStorage', {
            clear: () => values.clear(),
            getItem: (key: string) => values.get(key) ?? null,
            removeItem: (key: string) => values.delete(key),
            setItem: (key: string, value: string) => values.set(key, value),
        });
        apiService = { get: vi.fn(() => of(users)) };
        service = new AuthService(apiService as unknown as ApiDataService);
    });

    afterEach(() => vi.unstubAllGlobals());

    it('logs in matching users and stores session data', async () => {
        await expect(firstValueFrom(service.login('admin@example.com', 'secret'))).resolves.toBe(true);

        expect(service.isLoggedIn()).toBe(true);
        expect(service.getUsername()).toBe('Admin');
        expect(apiService.get).toHaveBeenCalledWith('users');
    });

    it('rejects invalid credentials without creating a session', async () => {
        await expect(firstValueFrom(service.login('admin@example.com', 'wrong'))).resolves.toBe(false);

        expect(service.isLoggedIn()).toBe(false);
        expect(service.getUsername()).toBe('');
    });

    it('clears session data when logging out and finds users by email', async () => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', 'Admin');

        await expect(firstValueFrom(service.checkEmail('admin@example.com'))).resolves.toEqual(users[0]);
        service.logout();

        expect(service.isLoggedIn()).toBe(false);
        expect(service.getUsername()).toBe('');
    });
});
