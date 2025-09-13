import { Component, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-elogin',
  standalone: false,
  templateUrl: './elogin.component.html',
  styleUrls: ['./elogin.component.css']
})
export class EloginComponent {
  isLoginActive = true;
  mobileMenuOpen = false;
  selectedPhoto: string | ArrayBuffer | null = null;
  passwordStrength = 0;
  strengthColor = '#e74c3c';
  loading = false;
  error = '';
  returnUrl = '';
  
  employeeLoginData = {
    employeeId: '',
    password: ''
  };
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/employee';
  }

  @HostListener('window:scroll')
  handleScroll() {
    const header = document.querySelector('header');
    if (header) {
      header.style.boxShadow = window.scrollY > 50 
        ? '0 4px 12px rgba(0, 0, 0, 0.15)' 
        : '0 4px 12px rgba(0, 0, 0, 0.1)';
      header.style.background = window.scrollY > 50 
        ? 'rgba(44, 62, 80, 0.95)' 
        : 'var(--secondary-color)';
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  setActiveForm(isLogin: boolean, event?: Event) {
    if (event) event.preventDefault();
    this.isLoginActive = isLogin;
    this.mobileMenuOpen = false;
    this.error = '';
  }

  onLogin(loginForm: NgForm) {
    if (loginForm.invalid) return;
  
    const { employeeId, password } = this.employeeLoginData;
  
    this.authService.employeeLogin(employeeId, password).subscribe({
      next: (response) => {
        console.log('✅ Login Response:', response); // <--- ADD THIS
  
        if (response.roles?.includes('ROLE_EMPLOYEE')) {
          console.log('🔁 Navigating to /employee'); // <--- ADD THIS
          this.router.navigate(['/employee']);
        } else {
          this.error = 'Unauthorized';
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Login failed';
      }
    });
  }
  
  
  onCreateAccount(registerForm: NgForm) {
    // Form validation
    if (registerForm.invalid) return;
  
    // Password confirmation check
    if (registerForm.value.password !== registerForm.value.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }
  
    this.loading = true;
  
    // Prepare FormData
    const formData = new FormData();
    formData.append('employeeId', registerForm.value.employeeId);
    formData.append('companyName', registerForm.value.companyName);
    formData.append('fullName', registerForm.value.fullName);
    formData.append('email', registerForm.value.email);
    formData.append('password', registerForm.value.password);
  
    // Handle file upload
    const fileInput = document.getElementById('employeePhoto') as HTMLInputElement;
    if (fileInput.files?.[0]) {
      formData.append('photo', fileInput.files[0]);
    }
  
    // Submit registration
    this.authService.registerEmployee(formData)
      .subscribe({
        next: (response) => {
          // ✅ Store user data in localStorage
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('roles', JSON.stringify(response.roles));
          localStorage.setItem('userId', response.id);
          localStorage.setItem('fullName', response.fullName);
  
          // ✅ Update currentUser object to fix role-based navigation
          const currentUser = {
            username: response.username || response.fullName,
            id: response.id,
            email: response.email,
            fullName: response.fullName,
            roles: response.roles,
            token: response.accessToken
          };
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
  
          // ✅ Redirect with slight delay for guards to pick up new values
          setTimeout(() => {
            this.router.navigate(['/employee']).catch(err => {
              console.error('Navigation error:', err);
              window.location.href = '/employee';
            });
          }, 100);
  
          this.loading = false;
        },
        error: (error) => {
          this.error = error.error?.message || 'Registration failed';
          this.loading = false;
        }
      });
  }
  

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedPhoto = reader.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  checkPasswordStrength(password: string) {
    let strength = 0;
    
    if (password?.length >= 8) strength += 1;
    if (password?.length >= 12) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    if (strength <= 1) {
      this.passwordStrength = 25;
      this.strengthColor = '#e74c3c';
    } else if (strength <= 3) {
      this.passwordStrength = 50;
      this.strengthColor = '#f39c12';
    } else if (strength <= 4) {
      this.passwordStrength = 75;
      this.strengthColor = '#3498db';
    } else {
      this.passwordStrength = 100;
      this.strengthColor = '#2ecc71';
    }
  }
}