import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./dashboard/dashboard-module').then(m => m.DashboardModule)
  },
  {
    path: 'sliders',
    loadChildren: () => import('./sliders/sliders-module').then(m => m.SlidersModule)
  },
  {
    path: 'reservation',
    loadChildren: () => import('./reservation/reservation-module').then(m => m.ReservationModule)
  },
  {
    path: 'subject',
    loadChildren: () => import('./subject/subject-module').then(m => m.SubjectModule)
  },
  {
    path: 'levels',
    loadChildren: () => import('./levels/levels-module').then(m => m.LevelsModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications-module').then(m => m.NotificationsModule)
  },
  {
    path: 'conversations',
    loadChildren: () => import('./conversations/conversations-module').then(m => m.ConversationsModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./orders/orders-module').then(m => m.OrdersModule)
  },
  {
    path: 'teachers',
    loadChildren: () => import('./users/teachers/teachers-module').then(m => m.TeachersModule)
  },
  {
    path: 'students',
    loadChildren: () => import('./users/students/students-module').then(m => m.StudentsModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./products/products-module').then(m => m.ProductsModule)
  },
  {
    path: 'profits',
    loadChildren: () => import('./profits/profits-module').then(m => m.ProfitsModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings-module').then(m => m.SettingsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModuleRoutingModule { }
