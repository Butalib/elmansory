import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing-module';
import { InnerActionHeader } from './inner-action-header/inner-action-header';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [InnerActionHeader],
  imports: [CommonModule, SharedRoutingModule , ReactiveFormsModule],
  exports: [InnerActionHeader],
})
export class SharedModule {}
