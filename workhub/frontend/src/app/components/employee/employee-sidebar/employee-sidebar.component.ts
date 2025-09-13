import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { EmployeeService } from '../../../auth/employee.service';

@Component({
  selector: 'app-employee-sidebar',
  standalone: false,
  templateUrl: './employee-sidebar.component.html',
  styleUrls: ['./employee-sidebar.component.css']
})
export class EmployeeSidebarComponent implements OnInit {
  isCollapsed = false;
  userName = '';
  designation = '';
  loading = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private employeeService: EmployeeService   // 👈 injected
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  loadUserProfile(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.employeeService.getEmployeeProfile(currentUser.id).subscribe({
        next: (profile) => {
          this.userName = `${profile.firstName} ${profile.lastName}`;
          this.designation = profile.designation;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching employee profile:', err);
          this.userName = currentUser.username || 'Unknown User';
          this.designation = 'Employee';
          this.loading = false;
        }
      });
    }
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem('logout', Date.now().toString());

    this.router.navigate(['/home']).then(() => {
      window.location.reload();
    });
  }
}
