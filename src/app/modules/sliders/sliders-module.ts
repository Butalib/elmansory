import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SlidersRoutingModule } from './sliders-routing-module';
import { SlidersPage } from './sliders-page/sliders-page';
import { SharedModule } from '../shared/shared-module';
import { SlideCards } from './component/slide-cards/slide-cards';
import { SlideModel } from './slide-model/slide-model';

@NgModule({
  declarations: [SlidersPage, SlideCards, SlideModel],
  imports: [CommonModule, SlidersRoutingModule, SharedModule, SharedModule],
})
export class SlidersModule { }
