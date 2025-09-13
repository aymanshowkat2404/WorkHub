import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = `${environment.apiUrl}/leave`; // Replace with your actual API endpoint

  constructor(private http: HttpClient) { }

  submitLeaveRequest(leaveData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/request`, leaveData);
  }

  getLeaveBalance(employeeId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/balance/${employeeId}`);
  }

  getLeaveHistory(employeeId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/history/${employeeId}`);
  }
}