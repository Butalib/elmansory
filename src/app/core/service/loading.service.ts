import { Injectable, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly pendingRequests = signal(0);
  private readonly pendingPageTransitions = signal(0);

  readonly isHttpLoading = computed(() => this.pendingRequests() > 0);
  readonly isPageTransitionLoading = computed(() => this.pendingPageTransitions() > 0);
  readonly isPageLoading = computed(() => this.isHttpLoading() || this.isPageTransitionLoading());

  startRequest(): void {
    this.pendingRequests.update((count) => count + 1);
  }

  stopRequest(): void {
    this.pendingRequests.update((count) => Math.max(0, count - 1));
  }

  startPageTransition(): void {
    this.pendingPageTransitions.update((count) => count + 1);
  }

  stopPageTransition(): void {
    this.pendingPageTransitions.update((count) => Math.max(0, count - 1));
  }

  flashPageLoading(duration = 250): void {
    this.startPageTransition();

    setTimeout(() => {
      this.stopPageTransition();
    }, duration);
  }
}
