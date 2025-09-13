import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { HrProfile } from '../core/models/hr-profile.model';
import { HrDashboardStats } from '../core/models/dashboard-stats.model';
import { LeaveRequest } from '../core/models/leave-request.model';
import { Announcement } from '../core/models/announcement.model';
import { Observable, catchError } from 'rxjs';
import { AuthService } from '../auth/auth.service';



@Injectable({
  providedIn: 'root'
})
export class HrDashboardService {
  private apiUrl = `${environment.apiUrl}/hr`;

  constructor(private http: HttpClient,  private authService: AuthService) {}
  
  

  getDashboardStats() {
    return this.http.get<HrDashboardStats>(`${this.apiUrl}/dashboard/stats`);
  }

  getPendingLeaveRequests() {
    return this.http.get<LeaveRequest[]>(`${this.apiUrl}/leave-requests/pending`);
  }

  getUpcomingEvents() {
    return this.http.get<Event[]>(`${this.apiUrl}/upcoming-events`);
  }

  getRecentAnnouncements() {
    return this.http.get<Announcement[]>(`${this.apiUrl}/announcements`);
  }

  getUnreadNotifications() {
    return this.http.get<Notification[]>(`${this.apiUrl}/notifications`);
  }

  getHrProfile(hrId: string) {
    return this.http.get<HrProfile>(`${this.apiUrl}/profile/${hrId}`);
  }
  

  approveLeaveRequest(requestId: string) {
    return this.http.patch(`${this.apiUrl}/leave-requests/${requestId}/approve`, {});
  }

  rejectLeaveRequest(requestId: string) {
    return this.http.patch(`${this.apiUrl}/leave-requests/${requestId}/reject`, {});
  }

  markAllNotificationsAsRead() {
    return this.http.patch(`${this.apiUrl}/notifications/mark-all-read`, {});
  }
  addEmployee(employeeData: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/employees`,
      employeeData,
      this.authService.getAuthHeaders() // ✅ Correctly returns `{ headers: HttpHeaders }`
    );
  }
  
  addEvent(eventData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/events`, eventData, 
      this.authService.getAuthHeaders());
  }

  createAnnouncement(announcementData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/announcements`, announcementData, 
      this.authService.getAuthHeaders());
  }
  getLeaveRequests(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/leave-requests`);
  }

  // Function 2: Get upcoming birthdays
  getNotifications(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/notifications`);
  }
  bulkUploadEmployees(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
  
    return this.http.post<any>(`${this.apiUrl}/employees/bulk`, formData).pipe(
      catchError(this.handleError)
    );
  }
  
  downloadEmployeeTemplate(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/employees/template`, {
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError)
    );
  }
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    throw error;
  }
  
  
}