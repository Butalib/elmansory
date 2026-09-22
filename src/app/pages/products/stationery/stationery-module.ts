import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared-module';
import { StationeryRoutingModule } from './stationery-routing-module';
import { StationeryPage } from './pages/stationery-page/stationery-page';
import { StationeryFormPage } from './pages/stationery-form-page/stationery-form-page';
import { StationeryDetailsPage } from './pages/stationery-details-page/stationery-details-page';
import { StationeryFormComponent } from './components/stationery-form/stationery-form';
import { StationeryDetailsComponent } from './components/stationery-details/stationery-details';
import { StationeryVariantModal } from './components/stationery-variant-modal/stationery-variant-modal';

@NgModule({
  declarations: [
    StationeryPage,
    StationeryFormPage,
    StationeryDetailsPage,
    StationeryFormComponent,
    StationeryDetailsComponent,
    StationeryVariantModal,
  ],
  imports: [CommonModule, ReactiveFormsModule, SharedModule, StationeryRoutingModule],
})
export class StationeryModule {}
