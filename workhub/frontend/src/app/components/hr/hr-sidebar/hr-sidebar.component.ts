import { Component, Input } from '@angular/core';
import { HrDashboardService } from '../../../auth/hr-dashboard.service';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hr-sidebar',
  standalone: false,
  templateUrl: './hr-sidebar.component.html',
  styleUrls: ['./hr-sidebar.component.css'] // ✅ fixed
})
export class HrSidebarComponent {
  @Input() isSidebarActive = false;
  userName = '';
  loading = true;
  isCollapsed = false;

  constructor(
    private authService: AuthService,
    private hrDashboardService: HrDashboardService,
    private router: Router // ✅ inject Router properly
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.hrDashboardService.getHrProfile(currentUser.id.toString()).subscribe({
        next: (profile) => {
          this.userName = `${profile.firstName} ${profile.lastName}`;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading profile:', err);
          this.userName = currentUser.username;
          this.loading = false;
        }
      });
    }
  }

  logout() {
    // Clear all authentication data
    localStorage.clear();
    sessionStorage.clear();

    // Add random token to prevent back button cache
    localStorage.setItem('logout', Date.now().toString());

    // Navigate to home and reload
    this.router.navigate(['/home']).then(() => {
      window.location.reload(); // ensures complete cleanup
    });
  }
}
