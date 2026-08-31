import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotebooksPage } from './pages/notebooks-page/notebooks-page';
import { NotebookFormPage } from './pages/notebook-form-page/notebook-form-page';

const routes: Routes = [
  {
    path: '',
    component: NotebooksPage,
    pathMatch: 'full',
  },
  {
    path: 'add',
    component: NotebookFormPage,
  },
  {
    path: 'edit/:id',
    component: NotebookFormPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotebooksRoutingModule {}
