import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hr-leave',
  standalone: false,
  templateUrl: './hr-leave.component.html',
  styleUrl: './hr-leave.component.css'
})
export class HrLeaveComponent implements OnInit{

  activeTab: string = 'attendance';
  attendanceView: string = 'daily';
  
  // Attendance Data
  attendanceRecords: any[] = [];
  monthlySummary: any[] = [];
  selectedDate: string = new Date().toISOString().split('T')[0];
  selectedMonth: string = new Date().toISOString().substring(0, 7);
  
  manualAttendance: any = {
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    checkIn: '09:00',
    checkOut: '18:00',
    status: 'Present'
  };
  
  attendanceSettings: any = {
    startTime: '09:00',
    endTime: '18:00',
    gracePeriod: 15,
    halfDayThreshold: 4
  };
  
  // Leave Data
  leaveRequests: any[] = [];
  leaveBalances: any[] = [];
  leaveFilterStatus: string = 'All';
  
  leaveSettings: any = {
    sickLeave: 12,
    casualLeave: 10,
    earnedLeave: 15,
    maxContinuous: 30,
    holidays: '2023-01-01,2023-01-26,2023-08-15,2023-10-02,2023-12-25'
  };
  
  // Report Data
  reportType: string = 'LeaveSummary';
  reportStartDate: string = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
  reportEndDate: string = new Date().toISOString().split('T')[0];
  
  // Sample employee data
  employees: any[] = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Robert Johnson' },
    { id: 4, name: 'Emily Davis' }
  ];

  constructor() { }

  ngOnInit(): void {
    this.loadAttendanceRecords();
    this.loadLeaveRequests();
    this.loadLeaveBalances();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  setAttendanceView(view: string): void {
    this.attendanceView = view;
    if (view === 'daily') {
      this.loadAttendanceRecords();
    } else {
      this.loadMonthlyAttendance();
    }
  }

  loadAttendanceRecords(): void {
    // Simulate API call
    this.attendanceRecords = [
      { id: 1, employeeName: 'John Doe', checkIn: new Date(2023, 5, 15, 9, 5), checkOut: new Date(2023, 5, 15, 18, 10), status: 'Pending' },
      { id: 2, employeeName: 'Jane Smith', checkIn: new Date(2023, 5, 15, 9, 0), checkOut: new Date(2023, 5, 15, 17, 45), status: 'Present' },
      { id: 3, employeeName: 'Robert Johnson', checkIn: new Date(2023, 5, 15, 9, 20), checkOut: new Date(2023, 5, 15, 18, 30), status: 'Late' },
      { id: 4, employeeName: 'Emily Davis', checkIn: null, checkOut: null, status: 'Absent' }
    ];
  }

  loadMonthlyAttendance(): void {
    // Simulate API call
    this.monthlySummary = [
      { employeeName: 'John Doe', present: 20, absent: 2, late: 3, earlyOut: 1 },
      { employeeName: 'Jane Smith', present: 22, absent: 0, late: 0, earlyOut: 0 },
      { employeeName: 'Robert Johnson', present: 18, absent: 4, late: 5, earlyOut: 2 },
      { employeeName: 'Emily Davis', present: 19, absent: 3, late: 1, earlyOut: 0 }
    ];
  }

  submitManualAttendance(): void {
    // Simulate API call
    console.log('Manual attendance submitted:', this.manualAttendance);
    alert('Manual attendance recorded successfully!');
    this.manualAttendance = {
      employeeId: '',
      date: new Date().toISOString().split('T')[0],
      checkIn: '09:00',
      checkOut: '18:00',
      status: 'Present'
    };
  }

  saveAttendanceSettings(): void {
    // Simulate API call
    console.log('Attendance settings saved:', this.attendanceSettings);
    alert('Attendance settings saved successfully!');
  }

  approveRegularization(id: number): void {
    // Simulate API call
    console.log('Regularization approved for ID:', id);
    const record = this.attendanceRecords.find(r => r.id === id);
    if (record) {
      record.status = 'Present';
    }
  }

  rejectRegularization(id: number): void {
    // Simulate API call
    console.log('Regularization rejected for ID:', id);
    const record = this.attendanceRecords.find(r => r.id === id);
    if (record) {
      record.status = 'Absent';
    }
  }

  editAttendance(id: number): void {
    // Simulate API call
    console.log('Edit attendance for ID:', id);
    const record = this.attendanceRecords.find(r => r.id === id);
    if (record) {
      this.manualAttendance = {
        employeeId: this.employees.find(e => e.name === record.employeeName)?.id,
        date: this.selectedDate,
        checkIn: record.checkIn ? this.formatTime(record.checkIn) : '09:00',
        checkOut: record.checkOut ? this.formatTime(record.checkOut) : '18:00',
        status: record.status
      };
    }
  }

  loadLeaveRequests(): void {
    // Simulate API call
    this.leaveRequests = [
      { id: 1, employeeName: 'John Doe', leaveType: 'Sick Leave', startDate: new Date(2023, 5, 10), endDate: new Date(2023, 5, 12), days: 3, status: 'Approved' },
      { id: 2, employeeName: 'Jane Smith', leaveType: 'Casual Leave', startDate: new Date(2023, 5, 15), endDate: new Date(2023, 5, 16), days: 2, status: 'Pending' },
      { id: 3, employeeName: 'Robert Johnson', leaveType: 'Earned Leave', startDate: new Date(2023, 5, 20), endDate: new Date(2023, 5, 25), days: 6, status: 'Pending' },
      { id: 4, employeeName: 'Emily Davis', leaveType: 'Sick Leave', startDate: new Date(2023, 5, 5), endDate: new Date(2023, 5, 6), days: 2, status: 'Rejected' }
    ];

    if (this.leaveFilterStatus !== 'All') {
      this.leaveRequests = this.leaveRequests.filter(r => r.status === this.leaveFilterStatus);
    }
  }

  loadLeaveBalances(): void {
    // Simulate API call
    this.leaveBalances = [
      { employeeName: 'John Doe', sickLeave: 2, sickLeaveTotal: 12, casualLeave: 5, casualLeaveTotal: 10, earnedLeave: 10, earnedLeaveTotal: 15, totalTaken: 7 },
      { employeeName: 'Jane Smith', sickLeave: 0, sickLeaveTotal: 12, casualLeave: 3, casualLeaveTotal: 10, earnedLeave: 5, earnedLeaveTotal: 15, totalTaken: 8 },
      { employeeName: 'Robert Johnson', sickLeave: 5, sickLeaveTotal: 12, casualLeave: 8, casualLeaveTotal: 10, earnedLeave: 12, earnedLeaveTotal: 15, totalTaken: 15 },
      { employeeName: 'Emily Davis', sickLeave: 1, sickLeaveTotal: 12, casualLeave: 2, casualLeaveTotal: 10, earnedLeave: 3, earnedLeaveTotal: 15, totalTaken: 6 }
    ];
  }

  approveLeave(id: number): void {
    // Simulate API call
    console.log('Leave approved for ID:', id);
    const request = this.leaveRequests.find(r => r.id === id);
    if (request) {
      request.status = 'Approved';
    }
  }

  rejectLeave(id: number): void {
    // Simulate API call
    console.log('Leave rejected for ID:', id);
    const request = this.leaveRequests.find(r => r.id === id);
    if (request) {
      request.status = 'Rejected';
    }
  }

  viewLeaveDetails(id: number): void {
    // Simulate API call
    console.log('View leave details for ID:', id);
    const request = this.leaveRequests.find(r => r.id === id);
    if (request) {
      alert(`Leave Details:\nEmployee: ${request.employeeName}\nType: ${request.leaveType}\nFrom: ${request.startDate}\nTo: ${request.endDate}\nDays: ${request.days}\nStatus: ${request.status}`);
    }
  }

  saveLeaveSettings(): void {
    // Simulate API call
    console.log('Leave settings saved:', this.leaveSettings);
    alert('Leave settings saved successfully!');
  }

  generateReport(): void {
    // Simulate API call
    console.log('Generating report:', {
      type: this.reportType,
      startDate: this.reportStartDate,
      endDate: this.reportEndDate
    });
    alert(`Report (${this.reportType}) generated for period ${this.reportStartDate} to ${this.reportEndDate}`);
  }

  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}


