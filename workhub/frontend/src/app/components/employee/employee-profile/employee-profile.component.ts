// employee-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../../auth/employee.service';

@Component({
  selector: 'app-employee-profile',
  standalone:false,
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent implements OnInit {
  employee: any = {};
  editing: any = { about: false, skills: false, phone: false };

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    const employeeId = 1; // TODO: get from auth token or route param
    this.employeeService.getEmployeeProfile(employeeId).subscribe({
      next: (data) => {
        this.employee = data;
      },
      error: (err) => {
        console.error('Error loading profile', err);
      }
    });
  }

  toggleEdit(section: string) {
    this.editing[section] = !this.editing[section];
    if (!this.editing[section]) {
      this.saveProfile();
    }
  }

  saveProfile() {
    this.employeeService.updateEmployeeProfile(this.employee.id, this.employee).subscribe({
      next: () => console.log('Profile updated successfully'),
      error: (err) => console.error('Update failed:', err)
    });
  }
}
