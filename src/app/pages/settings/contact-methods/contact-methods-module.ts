import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactMethodsRoutingModule } from './contact-methods-routing-module';
import { ContactMethodsPage } from './contact-methods-page/contact-methods-page';

@NgModule({
  declarations: [ContactMethodsPage],
  imports: [CommonModule, ContactMethodsRoutingModule],
})
export class ContactMethodsModule {}
