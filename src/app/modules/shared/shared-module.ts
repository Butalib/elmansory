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
import { UiModalComponent } from './kit/model/ui-modal-component/ui-modal-component';
import { UiSelectComponent } from './kit/model/ui-select-component/ui-select-component';
import { UiImageUploadComponent } from './kit/model/ui-image-upload-component/ui-image-upload-component';
import { GenericTableComponent } from './generic-table-component/generic-table-component';
@NgModule({
  declarations: [
    InnerActionHeader,
    BtnSwitch,
    BtnEdit,
    BtnDelete,
    ConfirmationDialog,
    UiModalComponent,
    UiSelectComponent,
    UiImageUploadComponent,
    GenericTableComponent,
  ],
  imports: [CommonModule, SharedRoutingModule, ReactiveFormsModule, MatSlideToggleModule],
  exports: [
    InnerActionHeader,
    BtnSwitch,
    BtnEdit,
    BtnDelete,
    MatSlideToggleModule,
    UiModalComponent,
    UiImageUploadComponent,
    UiSelectComponent,
    GenericTableComponent,
  ],
})
export class SharedModule {}
