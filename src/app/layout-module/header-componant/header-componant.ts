import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { LayoutServices } from '../../core/service/Layout.service';

@Component({
  selector: 'app-header-componant',
  standalone: false,
  templateUrl: './header-componant.html',
  styleUrl: './header-componant.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();

  notificationsCount = signal<number>(0);
  userData = signal({
    name: 'Butalib',
    handle: '@butallib',
    role: 'Software Engineer',
    avatar: 'assets/img/dashbourd/avatar.jpg'
  });
  constructor(
    private router: Router,
    readonly layoutServices: LayoutServices
  ) { }

  ngOnInit(): void {
    this.updatePageTitle();

    this.subscription.add(
      this.router.events.pipe(
        filter((event) => event instanceof NavigationEnd)
      ).subscribe(() => {
        this.updatePageTitle();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private updatePageTitle(): void {
    const routeTitle = this.findActiveRouteTitle(this.router.routerState.snapshot.root);
    const fallbackTitle = this.layoutServices.findTitleByUrl(this.router.url);

    this.layoutServices.pageTitle.set(routeTitle || fallbackTitle);
  }

  private findActiveRouteTitle(route: ActivatedRouteSnapshot): string | null {
    let currentRoute: ActivatedRouteSnapshot | null = route;
    let title: string | null = null;

    while (currentRoute) {
      const routeTitle = currentRoute.data?.['title'];

      if (typeof routeTitle === 'string' && routeTitle.trim()) {
        title = routeTitle;
      }

      currentRoute = currentRoute.firstChild ?? null;
    }

    return title;
  }
}
