import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GovernorateRoutingModule } from './governorate-routing-module';
import { GovernoratePage } from './governorate-page/governorate-page';
import { GovernorateModal } from './governorate-modal/governorate-modal';
import { SharedModule } from '../../../shared/shared-module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [GovernoratePage, GovernorateModal],
  imports: [CommonModule, GovernorateRoutingModule, SharedModule, ReactiveFormsModule],
})
export class GovernorateModule { }
