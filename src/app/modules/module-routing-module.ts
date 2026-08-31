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
    data: { title: 'الرئيسية' },
    loadChildren: () => import('./dashboard/dashboard-module').then(m => m.DashboardModule)
  },
  {
    path: 'sliders',
    data: { title: 'السلايدرز' },
    loadChildren: () => import('./sliders/sliders-module').then(m => m.SlidersModule)
  },
  {
    path: 'reservation',
    data: { title: 'الحجوزات' },
    loadChildren: () => import('./reservation/reservation-module').then(m => m.ReservationModule)
  },
  {
    path: 'subject',
    data: { title: 'المواد' },
    loadChildren: () => import('./subject/subject-module').then(m => m.SubjectModule)
  },
  {
    path: 'levels',
    data: { title: 'المراحل الدراسية' },
    loadChildren: () => import('./levels/levels-module').then(m => m.LevelsModule)
  },
  {
    path: 'notifications',
    data: { title: 'الإشعارات' },
    loadChildren: () => import('./notifications/notifications-module').then(m => m.NotificationsModule)
  },
  {
    path: 'conversations',
    data: { title: 'المحادثات' },
    loadChildren: () => import('./conversations/conversations-module').then(m => m.ConversationsModule)
  },
  {
    path: 'orders',
    data: { title: 'الطلبات' },
    loadChildren: () => import('./orders/orders-module').then(m => m.OrdersModule)
  },
  {
    path: 'teachers',
    data: { title: 'المعلمين' },
    loadChildren: () => import('./users/teachers/teachers-module').then(m => m.TeachersModule)
  },
  {
    path: 'students',
    data: { title: 'الطلاب' },
    loadChildren: () => import('./users/students/students-module').then(m => m.StudentsModule)
  },
  {
    path: 'products',
    data: { title: 'المنتجات' },
    loadChildren: () => import('./products/products-module').then(m => m.ProductsModule)
  },
  {
    path: 'profits',
    data: { title: 'الأرباح' },
    loadChildren: () => import('./profits/profits-module').then(m => m.ProfitsModule)
  },
  {
    path: 'settings',
    data: { title: 'البيانات الأساسية' },
    loadChildren: () => import('./settings/settings-module').then(m => m.SettingsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModuleRoutingModule { }
