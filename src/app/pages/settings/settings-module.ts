import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing-module';
import { SettingPage } from './setting-page/setting-page';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from '../shared/shared-module';

@NgModule({
  declarations: [SettingPage],
  imports: [CommonModule, SettingsRoutingModule, RouterOutlet, SharedModule],
})
export class SettingsModule {}
