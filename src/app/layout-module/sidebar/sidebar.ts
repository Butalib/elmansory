import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { ISidebarItem } from '../../core/interface/ISidebarItem';
import { LayoutServices } from "../../core/service/Layout.service";

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})

export class Sidebar {
  @Input() isCollapsed = false;
  @Output() logoClick = new EventEmitter<void>();

  readonly menuItems: ISidebarItem[];
  constructor(private LayoutServices: LayoutServices) {

    this.menuItems = this.LayoutServices.menuItems;
  }

  readonly expandedMenuId = signal<string | null>(null);
  readonly isSidebarHovered = signal(false);

  onLogoClick(): void {
    this.logoClick.emit();
    this.expandedMenuId.set(null);
  }

  toggleMenu(menuId: string): void {
    if (this.isCollapsed) {
      return;
    }

    this.expandedMenuId.update(current =>
      current === menuId ? null : menuId
    );
  }
}
