import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationsRoutingModule } from './locations-routing-module';
import { LocationsShell } from './locations-shell/locations-page';

@NgModule({
  declarations: [LocationsShell],
  imports: [CommonModule, LocationsRoutingModule],
})
export class LocationsModule { }
