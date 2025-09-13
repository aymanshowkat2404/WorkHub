import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../../../auth/attendance.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-employee-attendance',
  standalone: false,
  templateUrl: './employee-attendance.component.html',
  styleUrls: ['./employee-attendance.component.css']
})
export class EmployeeAttendanceComponent implements OnInit {
  // Current logged-in user
  currentUser: any;

  // Mobile menu
  mobileMenuOpen: boolean = false;

  // Tabs
  activeTab: string = 'attendance';

  // Attendance info
  isClockedIn: boolean = false;
  clockInTime: string = '';
  attendanceRecords: any[] = [];
  filteredRecords: any[] = [];
  attendanceStats: { present: number; absent: number; late: number } = { present: 0, absent: 0, late: 0 };

  // Leave info
  leaveBalance: { annual: number; sick: number; casual: number; emergency: number } = { annual: 0, sick: 0, casual: 0, emergency: 0 };
  leaveApplication: { type: string; startDate: string; endDate: string; reason: string } = { type: '', startDate: '', endDate: '', reason: '' };
  leaveHistory: any[] = [];

  // Calendar
  currentTime: Date = new Date();
  currentLocation: string = '';
  currentMonthName: string = '';
  currentYear: number = new Date().getFullYear();
  calendarDays: any[] = [];

  // Filters
  recordFilter: string = '';
  searchTerm: string = '';

  constructor(
    private attendanceService: AttendanceService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    console.log('Logged in user:', this.currentUser);

    this.loadTodayAttendance();
    this.loadAttendanceHistory();
    this.generateCalendar();
  }

  // ===== Attendance Methods =====
  clockIn() {
    const userId = this.currentUser.id;
    this.attendanceService.recordClockIn(userId).subscribe({
      next: (res) => {
        this.isClockedIn = true;
        this.clockInTime = res.checkIn;
        alert(`Clocked in at ${this.clockInTime}`);
        this.loadAttendanceHistory();
      },
      error: (err) => {
        alert(`Failed to clock in: ${err.message}`);
      }
    });
  }

  clockOut() {
    const userId = this.currentUser.id;
    this.attendanceService.recordClockOut(userId).subscribe({
      next: (res) => {
        this.isClockedIn = false;
        alert(`Clocked out at ${res.checkOut}. Hours worked: ${res.hoursWorked}`);
        this.loadAttendanceHistory(); // Refresh records
      },
      error: (err) => {
        alert(`Failed to clock out: ${err.message}`);
      }
    });
  }
  

  loadTodayAttendance() {
    const userId = this.currentUser.id;
    this.attendanceService.getTodayAttendance(userId).subscribe({
      next: (data) => {
        this.isClockedIn = !!data?.checkIn && !data?.checkOut;
        this.clockInTime = data?.checkIn || '';
      },
      error: () => console.log('No attendance for today')
    });
  }

  loadAttendanceHistory() {
    const userId = this.currentUser.id;
    this.attendanceService.getAttendanceHistory(userId).subscribe({
      next: (records: any[]) => {
        this.attendanceRecords = records;
        this.filteredRecords = [...records];
      },
      error: (err) => console.error('Failed to load attendance history', err)
    });
  }

  // ===== Leave Methods =====
  submitLeaveApplication() {
    console.log('Leave application submitted:', this.leaveApplication);
    // TODO: Call backend API to submit leave
  }

  calculateLeaveDays(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  // ===== UI Methods =====
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  changeMonth(monthDelta: number) {
    // TODO: Update currentMonthName, currentYear, regenerate calendarDays
  }

  selectDay(day: any) {
    console.log('Selected day:', day);
    // TODO: Implement day selection logic
  }

  filterRecords() {
    this.filteredRecords = this.attendanceRecords.filter(r => {
      const matchesFilter = this.recordFilter ? r.status === this.recordFilter : true;
      const matchesSearch = this.searchTerm ? r.employeeName?.toLowerCase().includes(this.searchTerm.toLowerCase()) : true;
      return matchesFilter && matchesSearch;
    });
  }

  generateCalendar() {
    // TODO: Implement calendar generation logic
    this.calendarDays = [];
  }
}
