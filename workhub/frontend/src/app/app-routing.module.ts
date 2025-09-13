import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { EmployeeDashboardComponent } from './components/employee/employee-dashboard/employee-dashboard.component';
import { EmployeeProfileComponent } from './components/employee/employee-profile/employee-profile.component';
import { EditProfileComponent } from './components/employee/employee-profile/edit-profile/edit-profile.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { EmployeeAttendanceComponent } from './components/employee/employee-attendance/employee-attendance.component';
import { EmployeeSalaryComponent } from './components/employee/employee-salary/employee-salary.component';
import { EmployeeTasksComponent } from './components/employee/employee-tasks/employee-tasks.component';
import { EmployeeSupportComponent } from './components/employee/employee-support/employee-support.component';
import { EmployeePerformanceComponent } from './components/employee/employee-performance/employee-performance.component';
import { HrDashboardComponent } from './components/hr/hr-dashboard/hr-dashboard.component';
import { HrLayoutComponent } from './layouts/hr-layout/hr-layout.component';
import { HrEmployeeComponent } from './components/hr/hr-employee/hr-employee.component';
import { HrLeaveComponent } from './components/hr/hr-leave/hr-leave.component';
import { HrRecruitmentComponent } from './components/hr/hr-recruitment/hr-recruitment.component';
import { HrPayrollComponent } from './components/hr/hr-payroll/hr-payroll.component';
import { HrAnnouncementsComponent } from './components/hr/hr-announcements/hr-announcements.component';
import { HrPerformanceComponent } from './components/hr/hr-performance/hr-performance.component';
import { HrSettingsComponent } from './components/hr/hr-settings/hr-settings.component';
import { HrSupportComponent } from './components/hr/hr-support/hr-support.component';
import { EloginComponent } from './components/elogin/elogin.component';
import { AuthGuard } from './auth/auth.guard';
import { RoleGuard } from './auth/role.guard';
import { AboutComponent } from './components/home/about/about.component';
import { PricingComponent } from './components/home/pricing/pricing.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
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
      { path: 'employee', component: EmployeeDashboardComponent,
      canActivate: [AuthGuard,RoleGuard],
      data: { roles: ['ROLE_EMPLOYEE'] } },
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
      { path: 'dashboard', component: HrDashboardComponent,
      canActivate: [AuthGuard, RoleGuard],
      data: { roles: ['HR']  }
    },
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
  { path: '**', redirectTo: '/home' },// Handle 404 - Page not found

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }