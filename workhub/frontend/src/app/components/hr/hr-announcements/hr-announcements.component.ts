import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hr-announcements',
  standalone: false,
  templateUrl: './hr-announcements.component.html',
  styleUrl: './hr-announcements.component.css'
})
export class HrAnnouncementsComponent implements OnInit {
  stats = {
    todaysAnnouncements: 3,
    unreadNotifications: 12,
    pendingApprovals: 2
  };

  recentAnnouncements = [
    {
      title: 'Quarterly All-Hands Meeting',
      date: 'Today, 10:30 AM',
      preview: 'Join us for our Q2 all-hands meeting this Friday at 2 PM in the main auditorium...',
      author: 'Sarah Johnson (CEO)',
      views: 124
    },
    {
      title: 'New Remote Work Policy',
      date: 'Yesterday, 3:45 PM',
      preview: 'Starting next month, we will implement a hybrid work model with 3 days in office...',
      author: 'Michael Chen (HR)',
      views: 287
    },
    {
      title: 'Office Closure for Independence Day',
      date: '2 days ago',
      preview: 'The office will be closed on July 4th in observance of Independence Day...',
      author: 'Lisa Rodriguez (Operations)',
      views: 198
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateTo(route: string): void {
    console.log(`Navigating to ${route}`);
    // this.router.navigate([`/announcements/${route}`]);
    alert(`Navigating to ${route.replace('-', ' ')} section`);
  }

  createAnnouncement(): void {
    alert('Creating new announcement...');
    // Actual implementation would open announcement form
  }

  scheduleBroadcast(): void {
    alert('Scheduling broadcast...');
    // Actual implementation would open scheduling interface
  }
}
