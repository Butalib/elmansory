import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherPage } from './teacher-page/teacher-page';

const routes: Routes = [
  {
    path: '',
    component: TeacherPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeachersRoutingModule { }
