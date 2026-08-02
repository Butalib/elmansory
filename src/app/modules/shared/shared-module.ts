import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing-module';
import { InnerActionHeader } from './inner-action-header/inner-action-header';

@NgModule({
  declarations: [InnerActionHeader],
  imports: [CommonModule, SharedRoutingModule],
  exports: [InnerActionHeader],
})
export class SharedModule {}
