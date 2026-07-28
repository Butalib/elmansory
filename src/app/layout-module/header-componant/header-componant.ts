import { Component, Input, signal } from '@angular/core';
@Component({
  selector: 'app-header-componant',
  standalone: false,
  templateUrl: './header-componant.html',
  styleUrl: './header-componant.scss',
})
export class HeaderComponent {
  // 1. استقبال عنوان الصفحة من الـ Router أو الـ Layout الأب
  @Input() pageTitle: string = 'الرئيسية';

  // 2. عدد الإشعارات (ديناميك) - لو 0 الشارة هتختفي
  notificationsCount = signal<number>(0);

  // 3. بيانات المستخدم (ديناميك - لاحقاً هنجيبها من AuthService)
  userData = signal({
    name: 'Butalib',
    handle: '@butallib',
    role: 'Software Engineer', // ضفنا الـ Role زي ما طلبت
    avatar: 'assets/img/dashbourd/avatar.jpg' // مسار صورتك
  });
}
