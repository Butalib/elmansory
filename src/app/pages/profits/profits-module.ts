import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfitsRoutingModule } from './profits-routing-module';
import { ProfitsPage } from './profits-page/profits-page';
import { SharedModule } from '../shared/shared-module';

@NgModule({
  declarations: [ProfitsPage],
  imports: [CommonModule, ProfitsRoutingModule, SharedModule],
})
export class ProfitsModule { }
