import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  activeForm: 'login' | 'register' = 'login';
  loading = false;
  error = '';
  returnUrl = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.initForms();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/hr-dashboard';
  }

  initForms(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      agreeTerms: [false, Validators.requiredTrue]
    });
  }

  toggleForm(form: 'login' | 'register'): void {
    this.activeForm = form;
    this.error = '';
  }

  onLoginSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
  
    this.loading = true;
    const { email, password } = this.loginForm.value;
  
    this.authService.hrLogin(email, password)  // pass loginType as 'hr'
      .subscribe({
        next: (response) => {
          const roles = response.roles || [];
  
          if (roles.includes("ROLE_HR")) {
            this.router.navigate(['dashboard']);  // ✅ navigate to HR dashboard
          } else {
            this.error = 'You are not authorized as HR';
          }
  
          this.loading = false;
        },
        error: error => {
          this.error = error.error?.error || error.error?.message || 'Login failed';
          this.loading = false;
        }
      });
  }
  

  onRegisterSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }
  
    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }
  
    this.loading = true;
  
    const formData = {
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      confirmPassword: this.registerForm.value.confirmPassword,
      firstName: this.registerForm.value.firstName,
      lastName: this.registerForm.value.lastName,
      role: 'hr'
    };
  
    console.log("Sending to backend:", formData); // Debug log
  
    this.authService.registerHr(formData)
      .subscribe({
        next: (response) => {
          // Store the token if your backend returns one
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
          
          // Redirect to HR dashboard
          this.router.navigate(['/dashboard']);
          
          this.loading = false;
        },
        error: error => {
          this.error = error.error?.message || 'Registration failed';
          this.loading = false;
        }
      });
  }
}