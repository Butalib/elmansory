import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationsService } from '../../../core/service/notifications.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notification-page',
  standalone: false,
  templateUrl: './notification-page.html',
  styleUrl: './notification-page.scss',
}) export class NotificationPage implements OnInit {
  notificationForm!: FormGroup;
  isLoading = false; // متغير لإدارة حالة التحميل في الـ UI

  // استخدام inject() الحديثة لتقليل زحمة الـ Constructor
  private fb = inject(FormBuilder);
  private notificationsService = inject(NotificationsService);
  private toastr = inject(ToastrService); // لو حبيت تضيف إشعارات للمستخدم بعد الإرسال
  private destroyRef = inject(DestroyRef); // المرجع اللي هيعرفنا إن الـ Component اتدمر

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.notificationForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      reason: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    // 1. حماية: لو الفورم مش فاليد، بنظهر الأخطاء ونوقف التنفيذ
    if (this.notificationForm.invalid) {
      this.notificationForm.markAllAsTouched();
      return;
    }

    // 2. تحديث حالة الـ UI لبدء التحميل
    this.isLoading = true;
    const payload = this.notificationForm.value;

    // 3. الربط مع الـ Service
    // ملاحظة: استبدل دالة 'create' باسم الدالة اللي بتضيف بيانات في الـ GenericCrudService عندك (مثلاً post أو add)
    this.notificationsService.add(payload)
      // .pipe(
      //   // الأوبيريتور ده بيقفل الاشتراك فوراً لو المستخدم خرج من الصفحة
      //   takeUntilDestroyed(this.destroyRef) 
      // )
      .subscribe({
        next: (response) => {
          // 4. حالة النجاح
          this.isLoading = false;
          console.log('تم الإرسال بنجاح:', response);

          // تفريغ الفورم بعد الإرسال الناجح
          this.notificationForm.reset();
          this.toastr.success('تم إرسال الإشعار بنجاح');
          // هنا مستقبلاً ممكن تظهر Toast Message أو SweetAlert للمستخدم
        },
        error: (err) => {
          // 5. حالة الفشل
          this.isLoading = false;
          console.error('حدث خطأ أثناء الإرسال:', err);
          // هنا مستقبلاً تظهر رسالة خطأ للمستخدم
        }
      });
  }
}