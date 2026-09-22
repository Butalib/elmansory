import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentsPage } from './students-page/students-page';
import { StudentsModal } from './students-modal/students-modal';
import { StudentDetails } from './student-details/student-details';

const routes: Routes = [
  {
    path: '',
    component: StudentsPage,
    data: { title: 'الطلاب' },
  },
  {
    path: 'details/:id',
    component: StudentDetails,
    data: { title: 'تفاصيل الطالب' },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentsRoutingModule { }
