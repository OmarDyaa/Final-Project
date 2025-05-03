import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../core/services/account.service';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './reset-password.component.html',  
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
  ],
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  resetPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    token: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    // Pre-fill email and token from query parameters
    const email = this.route.snapshot.queryParamMap.get('email');
    const token = this.route.snapshot.queryParamMap.get('token');
    if (email) this.resetPasswordForm.patchValue({ email });
    if (token) this.resetPasswordForm.patchValue({ token });
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      this.accountService.resetPassword(this.resetPasswordForm.getRawValue() as { email: string; token: string; newPassword: string }).subscribe({
        next: () => {
          alert('Password reset successfully. You can now log in.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Error resetting password:', err);
          alert('Error resetting password. Please try again.');
        },
      });
    }
  }
}