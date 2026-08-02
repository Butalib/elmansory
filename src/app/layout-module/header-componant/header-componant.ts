import { Component, Input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { LayoutServices } from '../../core/service/Layout.service';
@Component({
  selector: 'app-header-componant',
  standalone: false,
  templateUrl: './header-componant.html',
  styleUrl: './header-componant.scss',
})
export class HeaderComponent implements OnInit {
  pageTitle: string = "";
  notificationsCount = signal<number>(0);
  userData = signal({
    name: 'Butalib',
    handle: '@butallib',
    role: 'Software Engineer', // ضفنا الـ Role زي ما طلبت
    avatar: 'assets/img/dashbourd/avatar.jpg' // مسار صورتك
  });
  constructor(
    private router: Router,
    readonly layoutServices: LayoutServices
  ) { }
ngOnInit() {
    // 2. معالجة الـ Initial Load: نقرأ الـ URL الحالي فوراً أول ما الهيدر يتولد
    this.updatePageTitle(this.router.url);

    // 3. معالجة التنقلات المستقبلية: نستمع للراوتر 
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updatePageTitle(event.urlAfterRedirects || event.url);
    });
  }

  // 4. Clean Code: عملنا دالة مساعدة عشان نمنع تكرار الكود (DRY Principle)
  private updatePageTitle(url: string) {
    const urlSegments = url.split('/');
    const currentRoutePath = urlSegments[urlSegments.length - 1];
    
    // البحث في السيرفس بناءً على المسار
    const newTitle = this.layoutServices.findTitleByRoute(currentRoutePath);
    
    // تحديث مصدر الحقيقة (Single Source of Truth)
    this.layoutServices.pageTitle.set(newTitle);
  }
} 
