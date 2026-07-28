import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutModuleRoutingModule } from './layout-module-routing-module';
import { LayoutComponant } from './layout-componant/layout-componant';
import { Sidebar } from './sidebar/sidebar';
import {  HeaderComponent } from './header-componant/header-componant';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LayoutComponant, Sidebar, HeaderComponent],
  imports: [CommonModule, LayoutModuleRoutingModule, RouterModule],
  exports: [LayoutComponant, Sidebar, HeaderComponent],
})
export class LayoutModuleModule {}
