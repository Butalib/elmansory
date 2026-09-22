import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SlidersRoutingModule } from './sliders-routing-module';
import { SlidersPage } from './sliders-page/sliders-page';
import { SharedModule } from '../shared/shared-module';
import { SlideCards } from './component/slide-cards/slide-cards';
import { SlideModelComponent } from './slide-model/slide-model';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SlidersPage, SlideCards, SlideModelComponent],
  imports: [CommonModule, SlidersRoutingModule, SharedModule, ReactiveFormsModule],
})
export class SlidersModule { }
