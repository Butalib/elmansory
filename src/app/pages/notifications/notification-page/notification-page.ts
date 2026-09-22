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
  isLoading = false;


  private fb = inject(FormBuilder);
  private notificationsService = inject(NotificationsService);
  private toastr = inject(ToastrService);
  private destroyRef = inject(DestroyRef);

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

    if (this.notificationForm.invalid) {
      this.notificationForm.markAllAsTouched();
      return;
    }


    this.isLoading = true;
    const payload = this.notificationForm.value;


    this.notificationsService.add(payload)


      .subscribe({
        next: (response) => {

          this.isLoading = false;
          console.log('تم الإرسال بنجاح:', response);


          this.notificationForm.reset();
          this.toastr.success('تم إرسال الإشعار بنجاح');

        },
        error: (err) => {

          this.isLoading = false;
          console.error('حدث خطأ أثناء الإرسال:', err);

        }
      });
  }
}