import { Component, HostBinding, HostListener, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoadingService } from '../../core/service/loading.service';

@Component({
  selector: 'app-layout-componant',
  standalone: false,
  templateUrl: './layout-componant.html',
  styleUrl: './layout-componant.scss',
})
export class LayoutComponant implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly loadingService = inject(LoadingService);
  private readonly compactBreakpoint = 668;
  private readonly minimumPageLoadingTime = 460;
  private routerEventsSubscription?: Subscription;
  private pageLoadingStopTimer?: ReturnType<typeof setTimeout>;
  private pageLoadingStartedAt = 0;
  private isPageTransitionActive = false;

  readonly isSidebarCollapsed = signal(false);
  readonly isCompactViewport = signal(false);

  @HostBinding('class.sidebar-collapsed')
  get sidebarCollapsedClass(): boolean {
    return this.isSidebarCollapsed();
  }

  @HostBinding('class.compact-sidebar')
  get compactSidebarClass(): boolean {
    return this.isCompactViewport();
  }

  ngOnInit() {
    this.syncSidebarWithViewport();
    this.trackPageTransitions();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.syncSidebarWithViewport();
  }

  toggleSidebarFromLogo(): void {
    if (this.isCompactViewport()) {
      this.isSidebarCollapsed.set(true);
      return;
    }

    this.isSidebarCollapsed.update((isCollapsed) => !isCollapsed);
  }

  ngOnDestroy(): void {
    this.routerEventsSubscription?.unsubscribe();

    if (this.pageLoadingStopTimer) {
      clearTimeout(this.pageLoadingStopTimer);
    }

    if (this.isPageTransitionActive) {
      this.loadingService.stopPageTransition();
    }
  }

  private syncSidebarWithViewport(): void {
    const isCompact = window.innerWidth <= this.compactBreakpoint;
    this.isCompactViewport.set(isCompact);

    if (isCompact) {
      this.isSidebarCollapsed.set(true);
    }
  }

  private trackPageTransitions(): void {
    this.routerEventsSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.startPageLoading();
        return;
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.stopPageLoading();
      }
    });
  }

  private startPageLoading(): void {
    if (this.pageLoadingStopTimer) {
      clearTimeout(this.pageLoadingStopTimer);
    }

    this.pageLoadingStartedAt = Date.now();

    if (!this.isPageTransitionActive) {
      this.isPageTransitionActive = true;
      this.loadingService.startPageTransition();
    }
  }

  private stopPageLoading(): void {
    if (!this.isPageTransitionActive) {
      return;
    }

    const elapsed = Date.now() - this.pageLoadingStartedAt;
    const remainingTime = Math.max(0, this.minimumPageLoadingTime - elapsed);

    this.pageLoadingStopTimer = setTimeout(() => {
      this.isPageTransitionActive = false;
      this.loadingService.stopPageTransition();
    }, remainingTime);
  }
}
