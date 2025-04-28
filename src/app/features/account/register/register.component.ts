import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { AccountService } from '../../../core/services/account.service';
import { Router, RouterLink } from '@angular/router';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatIcon,
    MatInput,
    MatFormField,
    MatButton,
    MatIconButton,
    MatLabel,
    MatError,
    MatCheckbox,
    RouterLink,
    MatProgressSpinner
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private snack = inject(SnackbarService);
  validationErrors?: string[];
  hidePassword = true;
  isLoading = false;

  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    acceptTerms: [false, Validators.requiredTrue]
  });
  
  onSubmit() {
    if (this.registerForm.invalid) return;
    
    this.isLoading = true;
    // Remove acceptTerms from the payload before sending
    const registrationData = {
      firstName: this.registerForm.get('firstName')?.value,
      lastName: this.registerForm.get('lastName')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value
    };
    
    this.accountService.register(registrationData).subscribe({
      next: () => {
        this.snack.success('Registration successful - you can now login');
        this.router.navigateByUrl('/account/login');
      },
      error: (errors) => {
        this.validationErrors = errors;
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
