import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingPage } from './setting-page/setting-page';

const routes: Routes = [
  {
    path: '',
    component: SettingPage,
    children: [
      { path: '', redirectTo: 'locations', pathMatch: 'full' },

      {
        path: 'locations',
        data: { title: 'المناطق والمحافظات' },
        loadChildren: () => import('./locations/locations-module').then(m => m.LocationsModule)
      },
      {
        path: 'contact-methods',
        data: { title: 'طرق التواصل' },
        loadChildren: () => import('./contact-methods/contact-methods-module').then(m => m.ContactMethodsModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule { }
