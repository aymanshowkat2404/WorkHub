import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../core/models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  private setCurrentUser(user: any): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  hrLogin(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login/hr`, {
      username: email,
      password: password,
      loginType: 'hr'
    }).pipe(
      tap(response => {
        if (response.accessToken) {
          const user = {
            username: response.username,
            id: response.id,
            email: response.email,
            fullName: response.fullName,
            roles: response.roles,
            token: response.accessToken
          };
          this.setCurrentUser(user);
        }
      })
    );
  }

  employeeLogin(employeeId: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login/employee`, {
      employeeId,
      password,
      loginType: 'employee'
    }).pipe(
      tap(response => {
        if (response.accessToken) {
          const user = {
            username: response.username,
            id: response.id,
            email: response.email,
            fullName: response.fullName,
            companyName: response.companyName,
            designation: response.designation,   // 👈 add this
            roles: response.roles,
            token: response.accessToken
          };
          this.setCurrentUser(user);
        }
      })
    );
  }
  

  registerEmployee(formData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/employee`, formData);
  }

  registerHr(formData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/hr`, formData);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
  getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('accessToken');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }
  getCurrentUser(): Observable<any> {
    const currentUser = this.currentUserValue;
    if (!currentUser || !currentUser.token) {
      throw new Error('User not authenticated');
    }
  
    return this.http.get(`${environment.apiUrl}/users/me`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${currentUser.token}`
      })
    });
  }
  requestHrPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }
  
  requestEmployeePasswordReset(email: string, employeeId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email, employeeId });
  }
  
}
