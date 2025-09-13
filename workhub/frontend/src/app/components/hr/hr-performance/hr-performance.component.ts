import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hr-performance',
  standalone: false,
  templateUrl: './hr-performance.component.html',
  styleUrl: './hr-performance.component.css'
})
export class HrPerformanceComponent  implements OnInit {
  stats = {
    pendingReviews: 24,
    currentCycle: 'Q2 2023',
    averageRating: 3.8
  };

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateTo(route: string): void {
    console.log(`Navigating to ${route}`);
    // this.router.navigate([`/performance/${route}`]);
    alert(`Navigating to ${route.replace('-', ' ')} section`);
  }

  startAppraisalCycle(): void {
    alert('Starting new appraisal cycle...');
    // Actual implementation would call performance service
  }

  sendReminders(): void {
    alert('Sending reminders to managers...');
    // Actual implementation would call notification service
  }
}
