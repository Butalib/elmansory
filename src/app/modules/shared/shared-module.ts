import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing-module';
import { InnerActionHeader } from './inner-action-header/inner-action-header';
import { ReactiveFormsModule } from '@angular/forms';
import { BtnSwitch } from './kit/action/btn-switch/btn-switch';
import { BtnEdit } from './kit/action/btn-edit/btn-edit';
import { BtnDelete } from './kit/action/btn-delete/btn-delete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ConfirmationDialog } from './confirmation-dialog/confirmation-dialog';
import { UiModalComponent } from './kit/ui-modal-component/ui-modal-component';
@NgModule({
  declarations: [InnerActionHeader, BtnSwitch, BtnEdit, BtnDelete, ConfirmationDialog, UiModalComponent],
  imports: [CommonModule, SharedRoutingModule, ReactiveFormsModule, MatSlideToggleModule],
  exports: [InnerActionHeader, BtnSwitch, BtnEdit, BtnDelete, MatSlideToggleModule, UiModalComponent],
})
export class SharedModule { }
