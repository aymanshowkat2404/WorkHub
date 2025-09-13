import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = `${environment.apiUrl}/attendance`; // Replace with your actual API endpoint

  constructor(private http: HttpClient) { }

  recordClockIn(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/clock-in`, { userId });
  }
  
  recordClockOut(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/clock-out/${userId}`, {});
  }
  
  getTodayAttendance(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/today/${userId}`);
  }
  
  getAttendanceHistory(userId: number, month?: number, year?: number): Observable<any> {
    let url = `${this.apiUrl}/history/${userId}`;
    if (month && year) {
      url += `?month=${month}&year=${year}`;
    }
    return this.http.get(url);
  }
  
}