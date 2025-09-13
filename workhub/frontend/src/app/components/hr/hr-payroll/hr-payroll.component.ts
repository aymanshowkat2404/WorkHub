import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hr-payroll',
  standalone: false,
  templateUrl: './hr-payroll.component.html',
  styleUrl: './hr-payroll.component.css'
})
export class HrPayrollComponent  implements OnInit {
  stats = {
    totalEmployees: 124,
    monthlyPayroll: 385600,
    pendingApprovals: 8
  };

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateTo(route: string): void {
    console.log(`Navigating to ${route}`);
    // this.router.navigate([`/payroll/${route}`]);
    alert(`Navigating to ${route.replace('-', ' ')} section`);
  }

  runPayroll(): void {
    alert('Running payroll process...');
    // Actual implementation would call payroll service
  }

  generateReports(): void {
    alert('Generating payroll reports...');
    // Actual implementation would call report service
  }
}
