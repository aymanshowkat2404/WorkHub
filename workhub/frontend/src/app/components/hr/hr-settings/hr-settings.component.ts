import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hr-settings',
  standalone: false,
  templateUrl: './hr-settings.component.html',
  styleUrl: './hr-settings.component.css'
})
export class HrSettingsComponent implements OnInit {
  stats = {
    activeUsers: 8,
    systemRoles: 5,
    upcomingHolidays: 3
  };

  recentChanges = [
    {
      type: 'Leave Policy Update',
      date: 'Today, 11:20 AM',
      description: 'Added new parental leave policy with 12 weeks paid leave',
      author: 'Admin User',
      status: 'Active'
    },
    {
      type: 'Department Structure',
      date: 'Yesterday, 3:45 PM',
      description: 'Added new Research & Development department',
      author: 'HR Manager',
      status: 'Pending Approval'
    },
    {
      type: 'Role Permissions',
      date: '2 days ago',
      description: 'Updated payroll manager access permissions',
      author: 'System Admin',
      status: 'Active'
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateTo(route: string): void {
    console.log(`Navigating to ${route}`);
    // this.router.navigate([`/settings/${route}`]);
    alert(`Navigating to ${route.replace('-', ' ')} section`);
  }

  backupSystem(): void {
    alert('Creating system backup...');
    // Actual implementation would handle backup
  }

  auditLogs(): void {
    alert('Displaying audit logs...');
    // Actual implementation would show logs
  }
}
