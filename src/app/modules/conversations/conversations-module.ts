import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ConversationsRoutingModule } from './conversations-routing-module';
import { ConversationsPage } from './conversations-page/conversations-page';

@NgModule({
  declarations: [ConversationsPage],
  imports: [CommonModule, FormsModule, ConversationsRoutingModule],
})
export class ConversationsModule {}
