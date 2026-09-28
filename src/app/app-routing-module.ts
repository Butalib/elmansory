import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/authentication-module').then((m) => m.AuthenticationModule),
  },
  {
    path: 'dashboard',
    canMatch: [adminGuard],
    canActivate: [adminGuard],
    canActivateChild: [adminGuard],
    loadChildren: () =>
      import('./layout-module/layout-module-module').then((m) => m.LayoutModuleModule),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
