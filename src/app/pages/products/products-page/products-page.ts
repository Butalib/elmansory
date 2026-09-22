import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-products-page',
  standalone: false,
  templateUrl: './products-page.html',
  styleUrl: './products-page.scss',
})
export class ProductsPage {
  private readonly router = inject(Router);
  private readonly currentUrl = signal(this.router.url);

  readonly showTabs = computed(() => {
    const url = this.currentUrl();

    return !url.includes('/add') && !url.includes('/edit/') && !url.includes('/details/');
  });

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentUrl.set(event.urlAfterRedirects);
      });
  }
}
