import { Injectable, signal } from '@angular/core';
import { ISidebarItem } from '../interface/ISidebarItem';

@Injectable({
  providedIn: 'root',
})
export class LayoutServices {
  pageTitle = signal<string>('');
  private readonly routeTitles: Record<string, string> = {
    products: 'المنتجات',
    notebooks: 'الملازم',
    stationery: 'المنتجات',
    add: 'إضافة منتج جديد',
  };

  readonly menuItems: ISidebarItem[] = [
    {
      id: 'dashboard',
      label: 'الرئيسية',
      icon: 'assets/icon/sidebar/home-07.svg',
      route: 'home'
    },
    {
      id: 'sliders',
      label: 'السلايدرز',
      icon: 'assets/icon/sidebar/megaphone-01.svg',
      route: 'sliders'
    },
    {
      id: 'reservation',
      label: 'الحجوزات',
      icon: 'assets/icon/sidebar/booking.svg',
      route: 'reservation'
    },
    {
      id: 'subject',
      label: 'المواد',
      icon: 'assets/icon/sidebar/materials.svg',
      route: 'subject'
    },
    {
      id: 'levels',
      label: 'المراحل الدراسية',
      icon: 'assets/icon/sidebar/levels.svg',
      route: 'levels'
    },
    {
      id: 'notifications',
      label: 'الإشعارات',
      icon: 'assets/icon/sidebar/notifications.svg',
      route: 'notifications'
    },
    {
      id: 'conversations',
      label: 'المحادثات',
      icon: 'assets/icon/sidebar/chat.svg',
      route: 'conversations'
    },
    {
      id: 'orders',
      label: 'الطلبات',
      icon: 'assets/icon/sidebar/orders.svg',
      route: 'orders'
    },
    {
      id: 'users',
      label: 'المستخدمين',
      icon: 'assets/icon/sidebar/users.svg',
      children: [
        {
          id: 'teachers',
          label: 'المعلمين',
          route: 'teachers'
        },
        {
          id: 'students',
          label: 'الطلاب',
          route: 'students'
        }
      ]
    },
    {
      id: 'products',
      label: 'المنتجات',
      icon: 'assets/icon/sidebar/products.svg',
      route: 'products'
    },
    {
      id: 'profits',
      label: 'الأرباح',
      icon: 'assets/icon/sidebar/profits.svg',
      route: 'profits'
    },
    {
      id: 'settings',
      label: 'البيانات الأساسية',
      icon: 'assets/icon/sidebar/settings.svg',
      route: 'settings'
    }
  ];
  findTitleByRoute(routePath: string): string {
    const matchedRouteTitle = this.routeTitles[routePath];
    if (matchedRouteTitle) {
      return matchedRouteTitle;
    }

    for (const item of this.menuItems) {
      if (item.route === routePath) {
        return item.label;
      }
      if (item.children) {
        const childMatch = item.children.find(child => child.route === routePath);
        if (childMatch) {
          return childMatch.label;
        }
      }
    }
    return 'الرئيسية';
  }

  findTitleByUrl(url: string): string {
    const cleanUrl = url.split('?')[0].split('#')[0];
    const segments = cleanUrl.split('/').filter(Boolean);

    if (segments.includes('orders') && segments.includes('details')) {
      return 'تفاصيل الطلب';
    }

    if (segments.includes('students') && segments.includes('details')) {
      return 'تفاصيل الطالب';
    }

    if (segments.includes('settings') && segments.includes('contact-methods')) {
      return 'طرق التواصل';
    }

    if (segments.includes('settings') && segments.includes('locations')) {
      if (segments.includes('region')) {
        return 'المناطق';
      }

      if (segments.includes('governorate')) {
        return 'المحافظات';
      }

      return 'المناطق والمحافظات';
    }

    const currentRoutePath = segments[segments.length - 1] ?? '';
    return this.findTitleByRoute(currentRoutePath);
  }
}
