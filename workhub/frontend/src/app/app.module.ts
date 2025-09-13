import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatTabsModule } from '@angular/material/tabs';



import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { EmployeeDashboardComponent } from './components/employee/employee-dashboard/employee-dashboard.component';
import { EmployeeSidebarComponent } from './components/employee/employee-sidebar/employee-sidebar.component';
import { EmployeeProfileComponent } from './components/employee/employee-profile/employee-profile.component';
import { EditProfileComponent } from './components/employee/employee-profile/edit-profile/edit-profile.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { EmployeeAttendanceComponent } from './components/employee/employee-attendance/employee-attendance.component';
import { EmployeeSalaryComponent } from './components/employee/employee-salary/employee-salary.component';
import { EmployeeTasksComponent } from './components/employee/employee-tasks/employee-tasks.component';
import { EmployeePerformanceComponent } from './components/employee/employee-performance/employee-performance.component';
import { EmployeeSupportComponent } from './components/employee/employee-support/employee-support.component';
import { HrDashboardComponent } from './components/hr/hr-dashboard/hr-dashboard.component';
import { HrSidebarComponent } from './components/hr/hr-sidebar/hr-sidebar.component';
import { HrLayoutComponent } from './layouts/hr-layout/hr-layout.component';
import { HrEmployeeComponent } from './components/hr/hr-employee/hr-employee.component';
import { HrLeaveComponent } from './components/hr/hr-leave/hr-leave.component';
import { HrRecruitmentComponent } from './components/hr/hr-recruitment/hr-recruitment.component';
import { HrPayrollComponent } from './components/hr/hr-payroll/hr-payroll.component';
import { HrPerformanceComponent } from './components/hr/hr-performance/hr-performance.component';
import { HrAnnouncementsComponent } from './components/hr/hr-announcements/hr-announcements.component';
import { HrSupportComponent } from './components/hr/hr-support/hr-support.component';
import { HrSettingsComponent } from './components/hr/hr-settings/hr-settings.component';
import { EloginComponent } from './components/elogin/elogin.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { AddEmployeeDialogComponent } from './components/hr/add-employee-dialog/add-employee-dialog.component';
import { AddAnnouncementDialogComponent } from './components/hr/add-announcement-dialog/add-announcement-dialog.component';
import { AddEventDialogComponent } from './components/hr/add-event-dialog/add-event-dialog.component';
import { ViewLeaveRequestsDialogComponent } from './components/hr/view-leave-requests-dialog/view-leave-requests-dialog.component';
import { NotificationsDialogComponent } from './components/hr/notifications-dialog/notifications-dialog.component';
import { AttendanceDialogComponent } from './components/employee/attendance-dialog/attendance-dialog.component';
import { LeaveRequestDialogComponent } from './components/employee/leave-request-dialog/leave-request-dialog.component';
import { PayslipDialogComponent } from './components/employee/payslip-dialog/payslip-dialog.component';
import { TaskQuickAddDialogComponent } from './components/employee/task-quick-add-dialog/task-quick-add-dialog.component';
import { AboutComponent } from './components/home/about/about.component';
import { PricingComponent } from './components/home/pricing/pricing.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';



const routes: Routes = [

  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'pricing', component: PricingComponent },
      { path: 'login', component: LoginComponent },
      { path: 'elogin', component: EloginComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'employee/forgot-password', component: ForgotPasswordComponent }

    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'employee', component: EmployeeDashboardComponent },
      { path: 'profile', component: EmployeeProfileComponent },
      { path: 'edit', component: EditProfileComponent },
      {path: 'attendance', component: EmployeeAttendanceComponent },
      {path: 'salary', component: EmployeeSalaryComponent },
      {path: 'tasks', component: EmployeeTasksComponent },
      {path: 'performance', component: EmployeePerformanceComponent },
      {path: 'support', component: EmployeeSupportComponent }
      // Add all other sidebar-needed routes here
    ]
  },
  {
    path: '',
    component: HrLayoutComponent, // New HR layout component
    children: [
      { path: 'dashboard', component: HrDashboardComponent },
      { path: 'hremployee', component: HrEmployeeComponent },
      { path: 'hrleave', component: HrLeaveComponent },
      { path: 'hrrecruitment', component: HrRecruitmentComponent },
      { path: 'hrpayroll', component: HrPayrollComponent },
      { path: 'hrperformance', component: HrPerformanceComponent },
      { path: 'hrannouncements', component: HrAnnouncementsComponent },
      { path: 'hrsupport', component: HrSupportComponent },
      { path: 'hrsettings', component: HrSettingsComponent },
      // ... other HR routes
    ]
  },
  
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AuthLayoutComponent,
    MainLayoutComponent,
    EmployeeDashboardComponent,
    EmployeeSidebarComponent,
    EmployeeProfileComponent,
    EditProfileComponent,
    EmployeeAttendanceComponent,
    EmployeeSalaryComponent,
    EmployeeTasksComponent,
    EmployeePerformanceComponent,
    EmployeeSupportComponent,
    HrDashboardComponent,
    HrSidebarComponent,
    HrLayoutComponent,
    HrEmployeeComponent,
    HrLeaveComponent,
    HrRecruitmentComponent,
    HrPayrollComponent,
    HrPerformanceComponent,
    HrAnnouncementsComponent,
    HrSupportComponent,
    HrSettingsComponent,
    EloginComponent,
    AddEmployeeDialogComponent,
    AddEventDialogComponent,
    AddAnnouncementDialogComponent,
    ViewLeaveRequestsDialogComponent,
    NotificationsDialogComponent,
    AttendanceDialogComponent,
    LeaveRequestDialogComponent,
    PayslipDialogComponent,
    TaskQuickAddDialogComponent,
    AboutComponent,
    PricingComponent,
    ForgotPasswordComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    MatDialogModule,
    HttpClientModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule,
    MatTableModule,
    NgxMaterialTimepickerModule,
    MatTabsModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],

  bootstrap: [AppComponent]
})
export class AppModule { }