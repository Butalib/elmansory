import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeachersRoutingModule } from './teachers-routing-module';
import { TeacherPage } from './teacher-page/teacher-page';
import { SharedModule } from '../../shared/shared-module';
import { ReactiveFormsModule } from '@angular/forms';
import { TeachersModal } from './teachers-modal/teachers-modal';

@NgModule({
  declarations: [TeacherPage, TeachersModal],
  imports: [CommonModule, TeachersRoutingModule, SharedModule, ReactiveFormsModule],
})
export class TeachersModule {}
