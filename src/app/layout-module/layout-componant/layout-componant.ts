import { Component, HostBinding, HostListener, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout-componant',
  standalone: false,
  templateUrl: './layout-componant.html',
  styleUrl: './layout-componant.scss',
})
export class LayoutComponant implements OnInit {
  private readonly compactBreakpoint = 768;

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

  constructor(private router: Router) { }

  ngOnInit() {
    // console.log(this.router.url);
    this.syncSidebarWithViewport();
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

  private syncSidebarWithViewport(): void {
    const isCompact = window.innerWidth <= this.compactBreakpoint;
    this.isCompactViewport.set(isCompact);

    if (isCompact) {
      this.isSidebarCollapsed.set(true);
    }
  }
}
