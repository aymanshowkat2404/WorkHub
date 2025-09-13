import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hr-recruitment',
  standalone: false,
  templateUrl: './hr-recruitment.component.html',
  styleUrl: './hr-recruitment.component.css'
})
export class HrRecruitmentComponent implements OnInit {
  stats = {
    openPositions: 12,
    activeApplicants: 45,
    interviewsToday: 5
  };

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateTo(route: string): void {
    // In a real app, you would navigate to specific routes
    console.log(`Navigating to ${route}`);
    // this.router.navigate([`/recruitment/${route}`]);
    
    // For demo purposes, we'll just show an alert
    alert(`Navigating to ${route.replace('-', ' ')} section`);
  }
}

