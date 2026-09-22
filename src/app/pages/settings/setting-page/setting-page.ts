import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { HeaderStateService } from '../../../core/service/header-state.service';

@Component({
  selector: 'app-setting-page',
  standalone: false,
  templateUrl: './setting-page.html',
  styleUrl: './setting-page.scss',
})
export class SettingPage implements OnInit, OnDestroy {
  private readonly headerState = inject(HeaderStateService);
  private readonly router = inject(Router);
  private readonly subscriptions = new Subscription();

  config$ = this.headerState.config$;
  searchResetKey = 0;

  ngOnInit(): void {
    this.configureHeader(this.router.url);

    this.subscriptions.add(
      this.router.events.pipe(
        filter((event) => event instanceof NavigationEnd),
      ).subscribe((event) => {
        this.configureHeader(event.urlAfterRedirects);
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onActionClicked() {
    this.headerState.emitAction();
  }
  onSearch(term: string) {
    this.headerState.emitSearch(term);
  }
  onSortChange(direction: 'asc' | 'desc') {
    this.headerState.emitSort(direction);
  }
  onDateRangeChange(range: { startDate: string; endDate: string }) {
    this.headerState.emitDateRange(range);
  }

  private configureHeader(url: string): void {
    this.searchResetKey += 1;

    if (url.includes('/settings/contact-methods')) {
      this.headerState.setConfig({
        title: 'طرق التواصل',
        showSearch: true,
        showButton: false,
        buttonText: '',
        btnIcon: '',
        showFilterButton: false,
        showDate: false,
      });
      return;
    }

    if (url.includes('/settings/locations/region')) {
      this.headerState.setConfig({
        title: 'المناطق',
        showButton: true,
        buttonText: 'إضافة منطقة جديدة',
        btnIcon: 'assets/icon/main-header/add.svg',
        showSearch: true,
        showFilterButton: true,
        showDate: true,
      });
      return;
    }

    this.headerState.setConfig({
      title: 'المحافظات',
      showButton: true,
      buttonText: 'إضافة محافظة جديدة',
      btnIcon: 'assets/icon/main-header/add.svg',
      showSearch: true,
      showFilterButton: true,
      showDate: true,
    });
  }
}
