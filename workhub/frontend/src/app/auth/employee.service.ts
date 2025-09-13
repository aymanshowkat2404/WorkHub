import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
  export class EmployeeService {
    private apiUrl = `${environment.apiUrl}/employees`;
  
    constructor(private http: HttpClient) {}
  
    getEmployeeProfile(id: number): Observable<any> {
      const token = localStorage.getItem('accessToken');
      return this.http.get<any>(`${this.apiUrl}/${id}`, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`
        })
      });
    }
  
    updateEmployeeProfile(id: number, profile: any): Observable<any> {
        const token = localStorage.getItem('accessToken');
        return this.http.put<any>(`${this.apiUrl}/${id}/profile`, profile, {
          headers: new HttpHeaders({
            Authorization: `Bearer ${token}`
          })
        });
      }
  
    createEmployeeProfile(employeeData: any): Observable<any> {
      const token = localStorage.getItem('accessToken');
      return this.http.post<any>(this.apiUrl, employeeData, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        })
      });
    }
    
      
  }
  