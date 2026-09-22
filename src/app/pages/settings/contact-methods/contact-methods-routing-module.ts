import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactMethodsPage } from './contact-methods-page/contact-methods-page';

const routes: Routes = [
  {
    path: '',
    component: ContactMethodsPage,
    data: { title: 'طرق التواصل' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactMethodsRoutingModule {}
