import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubjectRoutingModule } from './subject-routing-module';
import { SubjectPage } from './subject-page/subject-page';
import { SubjectModal } from './subject-modal/subject-modal';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared-module';
import { SubjectCard } from './component/subject-card/subject-card';

@NgModule({
  declarations: [SubjectPage, SubjectModal, SubjectCard],
  imports: [CommonModule, SubjectRoutingModule, SharedModule, ReactiveFormsModule],
})
export class SubjectModule {}
