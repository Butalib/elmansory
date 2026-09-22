import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared-module';
import { NotebooksRoutingModule } from './notebooks-routing-module';
import { NotebooksPage } from './pages/notebooks-page/notebooks-page';
import { NotebookFormPage } from './pages/notebook-form-page/notebook-form-page';
import { NotebookFormComponent } from './components/notebook-form/notebook-form';

@NgModule({
  declarations: [NotebooksPage, NotebookFormPage, NotebookFormComponent],
  imports: [CommonModule, ReactiveFormsModule, SharedModule, NotebooksRoutingModule],
})
export class NotebooksModule {}
