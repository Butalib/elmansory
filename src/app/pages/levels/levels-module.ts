import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LevelsRoutingModule } from './levels-routing-module';
import { LevelsPage } from './levels-page/levels-page';
import { SharedModule } from '../shared/shared-module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LevelsPage],
  imports: [CommonModule, LevelsRoutingModule, SharedModule, ReactiveFormsModule],
})
export class LevelsModule { }
