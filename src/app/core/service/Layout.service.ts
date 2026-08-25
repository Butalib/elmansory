import { Injectable, signal } from '@angular/core';
import { ISidebarItem } from '../interface/ISidebarItem';

@Injectable({
  providedIn: 'root',
})
export class LayoutServices {
  pageTitle = signal<string>('');
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
}
