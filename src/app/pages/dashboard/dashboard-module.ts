import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing-module';
import { DashbourdPage } from './page/dashbourd-page/dashbourd-page';
import { NgApexchartsModule } from 'ng-apexcharts';
@NgModule({
  declarations: [DashbourdPage],
  imports: [CommonModule, DashboardRoutingModule , NgApexchartsModule ],
})
export class DashboardModule {}
