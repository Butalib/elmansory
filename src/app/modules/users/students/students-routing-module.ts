import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentsPage } from './students-page/students-page';
import { StudentsModal } from './students-modal/students-modal';

const routes: Routes = [
  {
    path: '',
    component: StudentsPage
  },
  {
    path: ':id',
    component: StudentsModal
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentsRoutingModule { }
