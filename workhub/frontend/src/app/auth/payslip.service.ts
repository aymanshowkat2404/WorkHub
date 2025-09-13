import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PayslipService {
  private apiUrl = `${environment.apiUrl}/payslip`; // Replace with your actual API endpoint

  constructor(private http: HttpClient) { }

  getPayslip(employeeId: string, month: number, year: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${employeeId}?month=${month}&year=${year}`);
  }

  downloadPayslip(employeeId: string, month: number, year: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${employeeId}?month=${month}&year=${year}`, {
      responseType: 'blob'
    });
  }

  emailPayslip(employeeId: string, month: number, year: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/email/${employeeId}`, { month, year });
  }
}