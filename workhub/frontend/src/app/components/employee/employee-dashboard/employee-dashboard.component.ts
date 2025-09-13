import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LeaveRequestDialogComponent } from '../leave-request-dialog/leave-request-dialog.component';
import { PayslipDialogComponent } from '../payslip-dialog/payslip-dialog.component';
import { AttendanceDialogComponent } from '../attendance-dialog/attendance-dialog.component';

import { LeaveService } from '../../../auth/leave.service';
import { PayslipService } from '../../../auth/payslip.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AttendanceService } from '../../../auth/attendance.service';
import { TaskService } from '../../../auth/task.service';

@Component({
  selector: 'app-employee-dashboard',
  standalone:false,
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {
  currentDateTime: string = 'Loading...';
  isSidebarOpen: boolean = true;
  currentUser: any;
  employeeData: any = null;
  todayAttendance: any = null;
  leaveBalance: any = null;
  userData: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private attendanceService: AttendanceService,
    private leaveService: LeaveService,
    private payslipService: PayslipService,
    private snackBar: MatSnackBar,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;

    if (!this.currentUser || !this.currentUser.roles.includes('ROLE_EMPLOYEE')) {
      this.router.navigate(['/elogin']);
      return;
    }

    this.loadEmployeeData();
    this.loadTodayAttendance();
    this.loadLeaveBalance();
    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 1000);
  }
  loadEmployeeData(): void {
    this.authService.getCurrentUser().subscribe({
      next: (data) => {
        console.log("Employee fetched:", data);
        // Merge DB values into the existing currentUser (token data)
        this.currentUser = {
          ...this.currentUser,
          ...data
        };
        this.employeeData = this.currentUser;
      },
      error: (err) => {
        console.error('Failed to fetch employee info', err);
      }
    });
  }
  
  
  loadTodayAttendance(): void {
    if (this.currentUser?.id) {
      this.attendanceService.getTodayAttendance(this.currentUser.id).subscribe({
        next: (data) => {
          this.todayAttendance = data;
        },
        error: (err) => {
          console.error('Failed to fetch today\'s attendance', err);
        }
      });
    }
  }

  loadLeaveBalance(): void {
    if (this.currentUser?.id) {
      this.leaveService.getLeaveBalance(this.currentUser.id).subscribe({
        next: (data) => {
          this.leaveBalance = data;
        },
        error: (err) => {
          console.error('Failed to fetch leave balance', err);
        }
      });
    }
  }

  updateDateTime(): void {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    this.currentDateTime = now.toLocaleDateString('en-US', options);
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  openAttendanceDialog(): void {
    const dialogRef = this.dialog.open(AttendanceDialogComponent, {
      width: '500px',
      data: { employeeId: this.currentUser?.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.action === 'clockIn') {
        this.attendanceService.recordClockIn(this.currentUser.id).subscribe({
          next: () => {
            this.snackBar.open('Clock-in recorded successfully!', 'Close', { duration: 3000 });
            this.loadTodayAttendance();
          },
          error: (err: any) => {
            this.snackBar.open('Failed to clock in', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      } else if (result.action === 'clockOut') {
        this.attendanceService.recordClockOut(this.currentUser.id).subscribe({
          next: () => {
            this.snackBar.open('Clock-out recorded successfully!', 'Close', { duration: 3000 });
            this.loadTodayAttendance();
          },
          error: (err: any) => {
            this.snackBar.open('Failed to clock out', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
      
    });
  }

  openLeaveRequestDialog(): void {
    const dialogRef = this.dialog.open(LeaveRequestDialogComponent, {
      width: '600px',
      data: { 
        employeeId: this.currentUser?.id,
        employeeName: `${this.employeeData?.firstName} ${this.employeeData?.lastName}`,
        leaveBalance: this.leaveBalance
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.leaveService.submitLeaveRequest(result).subscribe({
          next: () => {
            this.snackBar.open('Leave request submitted successfully!', 'Close', {
              duration: 3000
            });
            this.loadLeaveBalance();
          },
          error: (err) => {
            this.snackBar.open('Failed to submit leave request', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  navigateToTasks(): void {
    this.router.navigate(['/employee/tasks']);
  }

  openPayslipDialog(): void {
    const dialogRef = this.dialog.open(PayslipDialogComponent, {
      width: '800px',
      data: { 
        employeeId: this.currentUser?.id,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'download') {
        this.payslipService.downloadPayslip(
          this.currentUser.id,
          result.month,
          result.year
        ).subscribe(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `payslip_${result.month}_${result.year}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
        });
      } else if (result?.action === 'email') {
        this.payslipService.emailPayslip(
          this.currentUser.id,
          result.month,
          result.year
        ).subscribe({
          next: () => {
            this.snackBar.open('Payslip sent to your email!', 'Close', {
              duration: 3000
            });
          },
          error: (err) => {
            this.snackBar.open('Failed to email payslip', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
  getInitials(firstName: string, lastName: string): string {
    const first = firstName?.charAt(0).toUpperCase() || '';
    const last = lastName?.charAt(0).toUpperCase() || '';
    return first + last;
  }
  
}