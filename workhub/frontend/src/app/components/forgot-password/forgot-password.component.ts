// forgot-password.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  isEmployeeFlow: boolean = false;
  loading = false;
  submitted = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Check if we're in employee flow based on route or other logic
    this.isEmployeeFlow = this.router.url.includes('employee');
    
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      employeeId: ['']
    });
    
    // Only require employeeId for employee flow
    if (this.isEmployeeFlow) {
      this.forgotForm.get('employeeId')?.setValidators([Validators.required]);
    }
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    this.success = '';

    if (this.forgotForm.invalid) {
      return;
    }

    this.loading = true;
    
    const { email, employeeId } = this.forgotForm.value;

    if (this.isEmployeeFlow) {
      // Employee password reset flow
      this.authService.requestEmployeePasswordReset(email, employeeId)
        .subscribe({
          next: (response) => {
            this.success = 'Password reset instructions have been sent to your email.';
            this.loading = false;
          },
          error: (error) => {
            this.error = error.error?.message || 'Failed to process your request. Please try again.';
            this.loading = false;
          }
        });
    } else {
      // HR password reset flow
      this.authService.requestHrPasswordReset(email)
        .subscribe({
          next: (response) => {
            this.success = 'Password reset instructions have been sent to your email.';
            this.loading = false;
          },
          error: (error) => {
            this.error = error.error?.message || 'Failed to process your request. Please try again.';
            this.loading = false;
          }
        });
    }
  }

  goBack() {
    if (this.isEmployeeFlow) {
      this.router.navigate(['/employee-login']);
    } else {
      this.router.navigate(['/login']);
    }
  }
  mobileMenuOpen = false; // <-- define property

  toggleMobileMenu() {    // <-- define method
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}
