import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing-module';
import { InnerActionHeader } from './inner-action-header/inner-action-header';
import { ReactiveFormsModule } from '@angular/forms';
import { BtnSwitch } from './kit/action/btn-switch/btn-switch';
import { BtnEdit } from './kit/action/btn-edit/btn-edit';
import { BtnDelete } from './kit/action/btn-delete/btn-delete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
@NgModule({
  declarations: [InnerActionHeader, BtnSwitch, BtnEdit, BtnDelete],
  imports: [CommonModule, SharedRoutingModule, ReactiveFormsModule, MatSlideToggleModule],
  exports: [InnerActionHeader, BtnSwitch, BtnEdit, BtnDelete, MatSlideToggleModule],
})
export class SharedModule { }
