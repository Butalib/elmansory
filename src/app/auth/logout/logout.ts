import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/service/auth-service/auth.service';
import { SharedModule } from '../../modules/shared/shared-module';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './logout.html',
  styleUrl: './logout.scss',
})
export class LogoutComponent {
  @Input() isCollapsed = false;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isConfirmOpen = false;

  openConfirm(): void {
    this.isConfirmOpen = true;
  }

  closeConfirm(): void {
    this.isConfirmOpen = false;
  }

  confirmLogout(): void {
    this.authService.logout();
    this.isConfirmOpen = false;
    this.router.navigate(['/auth/login']);
  }
}
