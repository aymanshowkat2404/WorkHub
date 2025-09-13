import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { HrDashboardService } from '../../../auth/hr-dashboard.service';
import { MatDialog } from '@angular/material/dialog';
import { AddEmployeeDialogComponent } from '../add-employee-dialog/add-employee-dialog.component';
import { AddEventDialogComponent } from '../add-event-dialog/add-event-dialog.component';
import { AddAnnouncementDialogComponent } from '../add-announcement-dialog/add-announcement-dialog.component';
import { ViewLeaveRequestsDialogComponent } from '../view-leave-requests-dialog/view-leave-requests-dialog.component';
import { NotificationsDialogComponent } from '../notifications-dialog/notifications-dialog.component';


@Component({
  selector: 'app-hr-dashboard',
  standalone: false,
  templateUrl: './hr-dashboard.component.html',
  styleUrls: ['./hr-dashboard.component.css']
})
export class HrDashboardComponent implements OnInit {
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  isSidebarActive = false;
  notificationCount = 0;
  currentUser: any;
  loading = true;
  uploadInProgress = false;
  stats = {
    totalEmployees: 0,
    activeEmployees: 0,
    onLeaveToday: 0,
    resignedThisMonth: 0,
    upcomingBirthdays: 0
  };

  leaveRequests: any[] = [];
  upcomingEvents: any[] = [];
  announcements: any[] = [];
  notifications: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private hrDashboardService: HrDashboardService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (!this.currentUser || !this.currentUser.roles.includes('ROLE_HR')) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    this.hrDashboardService.getDashboardStats().subscribe({
      next: (stats) => this.stats = stats,
      error: (err) => console.error('Error loading stats:', err)
    });

    this.hrDashboardService.getPendingLeaveRequests().subscribe({
      next: (requests) => this.leaveRequests = requests,
      error: (err) => console.error('Error loading leave requests:', err)
    });

    this.hrDashboardService.getUpcomingEvents().subscribe({
      next: (events) => this.upcomingEvents = events,
      error: (err) => console.error('Error loading events:', err)
    });

    this.hrDashboardService.getRecentAnnouncements().subscribe({
      next: (announcements) => this.announcements = announcements,
      error: (err) => console.error('Error loading announcements:', err)
    });

    this.hrDashboardService.getUnreadNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.notificationCount = notifications.length;
      },
      error: (err) => console.error('Error loading notifications:', err),
      complete: () => this.loading = false
    });
  }

  addEmployee(): void {
    const dialogRef = this.dialog.open(AddEmployeeDialogComponent, {
      width: '800px',
      data: { 
        departments: this.getDepartments(),
        roles: ['Employee', 'Manager', 'Admin', 'HR'] 
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.type === 'single') {
          // Handle single employee addition
          this.hrDashboardService.addEmployee(result.data).subscribe({
            next: (newEmployee) => {
              this.showSuccessNotification('Employee added successfully');
              this.loadDashboardData(); // ✅ fetch updated stats from backend
            },
            error: (err) => {
              console.error('Error adding employee:', err);
              this.showErrorNotification('Failed to add employee');
            }
          });
          
        } else if (result.type === 'bulk') {
          // Handle bulk upload
          this.uploadInProgress = true;
          this.hrDashboardService.bulkUploadEmployees(result.file).subscribe({
            next: (response) => {
              this.stats.totalEmployees += response.addedCount;
              this.stats.activeEmployees += response.addedCount;
              this.showSuccessNotification(
                `Successfully added ${response.addedCount} employees. 
                ${response.skippedCount} duplicates skipped.`
              );
              
              this.uploadInProgress = false;
              this.loadDashboardData();
            },
            error: (err) => {
              console.error('Error in bulk upload:', err);
              this.showErrorNotification('Bulk upload failed. Please check your file format.');
              this.uploadInProgress = false;
            }
          });
        }
      }
    });
  }
  
  // Add this method to download template
  downloadTemplate(event: Event): void {
    event.preventDefault();
    this.hrDashboardService.downloadEmployeeTemplate().subscribe(blob => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = 'employee_upload_template.xlsx';
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }
  // View All Leave Requests
  viewAllLeaveRequests(): void {
    this.dialog.open(ViewLeaveRequestsDialogComponent, {
      width: '800px',
      data: { leaveRequests: this.leaveRequests }
    });
  }

  // Add New Event
  addEvent(): void {
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.hrDashboardService.addEvent(result).subscribe({
          next: (newEvent) => {
            this.upcomingEvents.unshift(newEvent);
            this.showSuccessNotification('Event added successfully');
          },
          error: (err) => {
            console.error('Error adding event:', err);
            this.showErrorNotification('Failed to add event');
          }
        });
      }
    });
  }

  // Create New Announcement
  createAnnouncement(): void {
    const dialogRef = this.dialog.open(AddAnnouncementDialogComponent, {
      width: '600px',
      data: { currentUser: this.currentUser }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.hrDashboardService.createAnnouncement(result).subscribe({
          next: (newAnnouncement) => {
            this.announcements.unshift(newAnnouncement);
            this.showSuccessNotification('Announcement created successfully');
          },
          error: (err) => {
            console.error('Error creating announcement:', err);
            this.showErrorNotification('Failed to create announcement');
          }
        });
      }
    });
  }

  // Open Notifications Panel
  openNotifications(): void {
    const dialogRef = this.dialog.open(NotificationsDialogComponent, {
      width: '400px',
      data: { notifications: this.notifications }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'marked-read') {
        this.notificationCount = 0;
      }
    });
  }

  // Helper Methods
  private getDepartments(): string[] {
    // This would typically come from a service
    return ['HR', 'Engineering', 'Marketing', 'Finance', 'Operations'];
  }

  private showSuccessNotification(message: string): void {
    // Implement your notification service or use MatSnackBar
    console.log('Success:', message);
  }

  private showErrorNotification(message: string): void {
    // Implement your notification service or use MatSnackBar
    console.error('Error:', message);
  }

  // Existing methods remain the same...
  toggleSidebar() {
    this.isSidebarActive = !this.isSidebarActive;
    this.toggleSidebarEvent.emit();
  }

  logout() {
    this.authService.logout();
  }

  approveLeave(requestId: string): void {
    this.hrDashboardService.approveLeaveRequest(requestId).subscribe({
      next: () => {
        this.leaveRequests = this.leaveRequests.filter(req => req.id !== requestId);
        this.stats.onLeaveToday++;
      },
      error: (err) => console.error('Error approving leave:', err)
    });
  }

  rejectLeave(requestId: string): void {
    this.hrDashboardService.rejectLeaveRequest(requestId).subscribe({
      next: () => {
        this.leaveRequests = this.leaveRequests.filter(req => req.id !== requestId);
      },
      error: (err) => console.error('Error rejecting leave:', err)
    });
  }

  refreshData() {
    window.location.reload();
  }
  

  markAllAsRead() {
    this.hrDashboardService.markAllNotificationsAsRead().subscribe({
      next: () => {
        this.notificationCount = 0;
        this.notifications = this.notifications.map(n => ({ ...n, isRead: true }));
      },
      error: (err) => console.error('Error marking notifications as read:', err)
    });
  }
}