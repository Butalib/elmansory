import { Component, signal } from '@angular/core';
import { ISidebarItem } from '../../core/interface/ISidebarItem';
import { LayoutServices } from "../../core/service/Layout.service";

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})

export class Sidebar {

  readonly menuItems: ISidebarItem[];
  constructor(private LayoutServices: LayoutServices) {

    this.menuItems = this.LayoutServices.menuItems;
  }

  readonly isCollapsed = signal(false);

  readonly expandedMenuId = signal<string | null>(null);
  readonly isSidebarHovered = signal(false);
  toggleSidebar(): void {
    this.isCollapsed.update(value => !value);
  }

  toggleMenu(menuId: string): void {
    this.expandedMenuId.update(current =>
      current === menuId ? null : menuId
    );
  }
}
