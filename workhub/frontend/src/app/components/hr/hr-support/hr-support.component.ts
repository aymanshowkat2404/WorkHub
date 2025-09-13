import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hr-support',
  standalone: false,
  templateUrl: './hr-support.component.html',
  styleUrl: './hr-support.component.css'
})
export class HrSupportComponent implements OnInit {
  stats = {
    openTickets: 18,
    avgResponseTime: 4.5,
    satisfactionRate: 92
  };

  recentTickets = [
    {
      id: 'SUP-2023-0456',
      title: 'VPN access issues',
      description: 'Unable to connect to company VPN from home network since yesterday evening.',
      author: 'James Wilson (IT Dept)',
      date: 'Today, 9:15 AM',
      priority: 'High',
      status: 'In Progress'
    },
    {
      id: 'SUP-2023-0455',
      title: 'Payroll discrepancy',
      description: 'My last paycheck was missing overtime hours from the 15th and 16th.',
      author: 'Maria Garcia (Accounting)',
      date: 'Yesterday, 2:30 PM',
      priority: 'Medium',
      status: 'Pending'
    },
    {
      id: 'SUP-2023-0454',
      title: 'New monitor request',
      description: 'Requesting a second monitor for my workstation to improve productivity.',
      author: 'David Kim (Marketing)',
      date: '2 days ago',
      priority: 'Low',
      status: 'Completed'
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateTo(route: string): void {
    console.log(`Navigating to ${route}`);
    // this.router.navigate([`/support/${route}`]);
    alert(`Navigating to ${route.replace('-', ' ')} section`);
  }

  createTicket(): void {
    alert('Opening new support ticket form...');
    // Actual implementation would open ticket creation form
  }

  escalatePriority(): void {
    alert('Escalating ticket priority...');
    // Actual implementation would handle priority escalation
  }
}
