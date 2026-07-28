import { Component ,signal  } from '@angular/core';
import { ISidebarItem } from '../../core/interface/ISidebarItem';
import {RouterLink , RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})

export class Sidebar {

  readonly isCollapsed = signal(false);

  readonly expandedMenuId = signal<string | null>(null);
  readonly isSidebarHovered = signal(false);

  readonly menuItems: ISidebarItem[] = [
    {
      id: 'dashboard',
      label: 'الرئيسية',
      icon: 'assets/icon/sidebar/home-07.svg',
      route: '/dashboard'
    },
    {
      id: 'sliders',
      label: 'السلايدر',
      icon: 'assets/icon/sidebar/megaphone-01.svg',
      route: '/dashboard/sliders'
    },
    {
      id: 'bookings',
      label: 'الحجوزات',
      icon: 'assets/icon/sidebar/booking.svg',
      route: '/dashboard/bookings'
    },
    {
      id: 'materials',
      label: 'المواد',
      icon: 'assets/icon/sidebar/materials.svg',
      route: '/dashboard/materials'
    },
    {
      id: 'levels',
      label: 'المراحل الدراسية',
      icon: 'assets/icon/sidebar/levels.svg',
      route: '/dashboard/levels'
    },
    {
      id: 'notifications',
      label: 'الإشعارات',
      icon: 'assets/icon/sidebar/notifications.svg',
      route: '/dashboard/notifications'
    },
    {
      id: 'conversations',
      label: 'المحادثات',
      icon: 'assets/icon/sidebar/chat.svg',
      route: '/dashboard/conversations'
    },
    {
      id: 'orders',
      label: 'الطلبات',
      icon: 'assets/icon/sidebar/orders.svg',
      route: '/dashboard/orders'
    },
    {
      id: 'users',
      label: 'المستخدمين',
      icon: 'assets/icon/sidebar/users.svg',
      children: [
        {
          id: 'teachers',
          label: 'المعلمين',
          route: '/dashboard/users/teachers'
        },
        {
          id: 'students',
          label: 'الطلاب',
          route: '/dashboard/users/students'
        }
      ]
    },
    {
      id: 'products',
      label: 'المنتجات',
      icon: 'assets/icon/sidebar/products.svg',
      route: '/dashboard/products'
    },
    {
      id: 'profits',
      label: 'الأرباح',
      icon: 'assets/icon/sidebar/profits.svg',
      route: '/dashboard/profits'
    },
    {
      id: 'settings',
      label: 'البيانات الأساسية',
      icon: 'assets/icon/sidebar/settings.svg',
      route: '/dashboard/settings'
    }
  ];

  toggleSidebar(): void {
    this.isCollapsed.update(value => !value);
  }

  toggleMenu(menuId: string): void {
    this.expandedMenuId.update(current =>
      current === menuId ? null : menuId
    );
  }
}
