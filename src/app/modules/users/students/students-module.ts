import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentsRoutingModule } from './students-routing-module';
import { StudentsPage } from './students-page/students-page';
import { StudentsModal } from './students-modal/students-modal';
import { StudentDetails } from './student-details/student-details';
import { SharedModule } from '../../shared/shared-module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [StudentsPage, StudentsModal, StudentDetails],
  imports: [CommonModule, StudentsRoutingModule, SharedModule, ReactiveFormsModule],

})
export class StudentsModule { }
