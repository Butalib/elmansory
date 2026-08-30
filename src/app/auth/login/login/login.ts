import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../../core/service/auth-service/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }
  isLoading = false;
  loginForm!: FormGroup;
  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.createForm();
  }
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.toastr.error(
        'Please fill in all required fields',
        'Form Error'
      );
      this.loginForm.markAllAsTouched();
      return;
    }
    const { email, password } = this.loginForm.value;
    this.isLoading = true;
    this.authService
      .login(email, password)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (isSuccess) => {
          if (isSuccess) {
            this.toastr.success(
              'Login successful',
              'Success'
            );
            this.router.navigate(['/dashboard']);
            return;
          }
          this.toastr.error(
            'Invalid email or password',
            'Login Failed'
          );
        },
        error: () => {
          this.toastr.error(
            'Something went wrong',
            'Server Error'
          );

        }

      });

  }

}