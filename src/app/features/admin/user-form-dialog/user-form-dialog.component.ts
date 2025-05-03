import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';

@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  template: `
    <div class="p-6">
      <h2 mat-dialog-title>Add New User</h2>
      <mat-dialog-content>
        <form [formGroup]="userForm" class="flex flex-col gap-4">
          <mat-form-field appearance="outline">
            <mat-label>First Name</mat-label>
            <input matInput formControlName="firstName" required />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Last Name</mat-label>
            <input matInput formControlName="lastName" required />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email" required />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Phone Number</mat-label>
            <input
              matInput
              formControlName="phoneNumber"
              type="tel"
              placeholder="e.g., +1234567890"
            />
            <mat-error *ngIf="userForm.get('phoneNumber')?.errors?.['pattern']">
              Please enter a valid phone number
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <input
              matInput
              formControlName="password"
              type="password"
              required
            />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Confirm Password</mat-label>
            <input
              matInput
              formControlName="confirmPassword"
              type="password"
              required
            />
            <mat-error *ngIf="userForm.errors?.['passwordMismatch']">
              Passwords do not match
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Role</mat-label>
            <mat-select formControlName="role" required>
              <mat-option value="customer">Customer</mat-option>
              <mat-option value="admin">Admin</mat-option>
              <mat-option value="editor">Editor</mat-option>
            </mat-select>
          </mat-form-field>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-stroked-button mat-dialog-close>Cancel</button>
        <button
          mat-flat-button
          color="primary"
          [disabled]="!userForm.valid"
          (click)="onSubmit()"
        >
          Create User
        </button>
      </mat-dialog-actions>
    </div>
  `,
})
export class UserFormDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<UserFormDialogComponent>);

  userForm = this.fb.group(
    {
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.pattern('^[+]?[0-9]{10,15}$')]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      role: ['customer', Validators.required],
    },
    { validators: this.passwordMatchValidator }
  );

  private passwordMatchValidator(form: any) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      const userData = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        phoneNumber: formValue.phoneNumber,
        password: formValue.password,
        confirmPassword: formValue.confirmPassword,
        roles: [formValue.role?.toLowerCase()],
      };
      this.dialogRef.close(userData);
    }
  }
}
