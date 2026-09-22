import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegionRoutingModule } from './region-routing-module';
import { RegionPage } from './region-page/region-page';
import { RegionModal } from './region-modal/region-modal';
import { SharedModule } from '../../../shared/shared-module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [RegionPage, RegionModal],
  imports: [CommonModule, RegionRoutingModule, SharedModule, ReactiveFormsModule],

})
export class RegionModule { }
