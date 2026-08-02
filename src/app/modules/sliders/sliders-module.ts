import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SlidersRoutingModule } from './sliders-routing-module';
import { SlidersPage } from './sliders-page/sliders-page';
import { SharedModule } from '../shared/shared-module';

@NgModule({
  declarations: [SlidersPage,],
  imports: [CommonModule, SlidersRoutingModule, SharedModule],
})
export class SlidersModule {}
