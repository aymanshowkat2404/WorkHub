import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`; // Replace with your actual API endpoint

  constructor(private http: HttpClient) { }

  createTask(taskData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, taskData);
  }

  getEmployeeTasks(employeeId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/employee/${employeeId}`);
  }

  updateTaskStatus(taskId: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${taskId}/status`, { status });
  }
}