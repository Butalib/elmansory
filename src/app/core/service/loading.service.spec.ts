import { describe, expect, it, vi } from 'vitest';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
    it('tracks HTTP loading while requests are pending', () => {
        const service = new LoadingService();

        expect(service.isHttpLoading()).toBe(false);
        service.startRequest();
        service.startRequest();
        expect(service.isHttpLoading()).toBe(true);

        service.stopRequest();
        expect(service.isHttpLoading()).toBe(true);
        service.stopRequest();
        expect(service.isHttpLoading()).toBe(false);
    });

    it('does not allow loading state to become negative', () => {
        const service = new LoadingService();

        service.stopRequest();
        service.stopPageTransition();

        expect(service.isHttpLoading()).toBe(false);
        expect(service.isPageTransitionLoading()).toBe(false);
        expect(service.isPageLoading()).toBe(false);
    });

    it('clears page transition loading after the requested duration', () => {
        vi.useFakeTimers();
        const service = new LoadingService();

        service.flashPageLoading(100);
        expect(service.isPageLoading()).toBe(true);

        vi.advanceTimersByTime(99);
        expect(service.isPageLoading()).toBe(true);
        vi.advanceTimersByTime(1);
        expect(service.isPageLoading()).toBe(false);

        vi.useRealTimers();
    });
});
