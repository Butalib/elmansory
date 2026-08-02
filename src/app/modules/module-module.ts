import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModuleRoutingModule } from './module-routing-module';
import { share } from 'rxjs';
import { SharedModule } from './shared/shared-module';

@NgModule({
  declarations: [],
  imports: [CommonModule, ModuleRoutingModule  ],
})
export class ModuleModule {}
