import { Component } from '@angular/core';

@Component({
  selector: 'app-employee-salary',
  standalone: false,
  templateUrl: './employee-salary.component.html',
  styleUrl: './employee-salary.component.css'
})
export class EmployeeSalaryComponent {
  mobileMenuOpen = false;
  
  // Payroll Summary
  payrollSummary = {
    currentMonthSalary: 8450.00,
    ytdEarnings: 12300.00,
    ytdTaxPaid: 3150.00,
    ytdReimbursements: 850.00
  };
  
  // Payslip Section
  availableMonths = [
    { value: 'june-2023', label: 'June 2023' },
    { value: 'may-2023', label: 'May 2023' },
    { value: 'april-2023', label: 'April 2023' },
    { value: 'march-2023', label: 'March 2023' }
  ];
  selectedMonth = '';
  selectedMonthForPreview = '';
  
  // Employee Details
  employeeDetails = {
    name: 'John Doe',
    employeeId: 'WH-10025',
    department: 'Engineering',
    position: 'Software Developer',
    bank: 'Chase Bank',
    accountNumber: '*****6789'
  };
  
  // Payslip Items
  payslipItems = [
    { description: 'Basic Salary', amount: 6500.00, type: 'earning' },
    { description: 'House Rent Allowance', amount: 1200.00, type: 'earning' },
    { description: 'Transport Allowance', amount: 500.00, type: 'earning' },
    { description: 'Bonus', amount: 250.00, type: 'earning' },
    { description: 'Federal Income Tax', amount: 1150.00, type: 'deduction' },
    { description: 'Social Security', amount: 450.00, type: 'deduction' },
    { description: 'Health Insurance', amount: 200.00, type: 'deduction' }
  ];
  
  // Salary Breakdown
  salaryPeriod = 'current';
  salaryBreakdown = [
    { component: 'Basic Salary', type: 'Earnings', amount: 6500.00 },
    { component: 'House Rent Allowance', type: 'Earnings', amount: 1200.00 },
    { component: 'Transport Allowance', type: 'Earnings', amount: 500.00 },
    { component: 'Bonus', type: 'Earnings', amount: 250.00 },
    { component: 'Federal Income Tax', type: 'Deductions', amount: 1150.00 },
    { component: 'Social Security', type: 'Deductions', amount: 450.00 },
    { component: 'Health Insurance', type: 'Deductions', amount: 200.00 }
  ];
  
  // Tax Deductions
  taxYear = '2023';
  availableTaxYears = ['2023', '2022', '2021'];
  federalTaxes = [
    { name: 'Income Tax', amount: 1150.00 },
    { name: 'Medicare', amount: 145.00 },
    { name: 'Social Security', amount: 450.00 }
  ];
  stateTaxes = [
    { name: 'State Income Tax', amount: 320.00 },
    { name: 'Disability Insurance', amount: 45.00 }
  ];
  ytdTaxSummary = {
    totalTaxPaid: 3150.00,
    taxableIncome: 48500.00,
    estimatedRefund: 450.00
  };
  
  // Reimbursements
  reimbursements = [
    { title: 'Business Travel Expenses', submittedDate: new Date(2023, 5, 15), amount: 450.00, status: 'approved' },
    { title: 'Office Supplies', submittedDate: new Date(2023, 5, 5), amount: 120.00, status: 'approved' },
    { title: 'Training Course', submittedDate: new Date(2023, 4, 28), amount: 280.00, status: 'approved' },
    { title: 'Client Entertainment', submittedDate: new Date(2023, 5, 18), amount: 175.00, status: 'pending' }
  ];

  ngOnInit() {
    // Initialize data
    this.updateSalaryBreakdown();
    this.updateTaxDeductions();
  }
  
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
  
  // Payslip Methods
  viewPayslip() {
    if (!this.selectedMonth) {
      alert('Please select a month first');
      return;
    }
    this.selectedMonthForPreview = this.selectedMonth;
  }
  
  downloadPayslip() {
    if (!this.selectedMonth) {
      alert('Please select a month first');
      return;
    }
    alert(`Downloading payslip for ${this.getMonthLabel(this.selectedMonth)}`);
    // In a real app, would generate and download PDF
  }
  
  getMonthLabel(monthValue: string): string {
    const month = this.availableMonths.find(m => m.value === monthValue);
    return month ? month.label : '';
  }
  
  getPaymentDate(monthValue: string): Date {
    // In a real app, would get this from backend
    return new Date(2023, this.getMonthIndex(monthValue), 30);
  }
  
  getPayPeriod(monthValue: string): string {
    const monthIndex = this.getMonthIndex(monthValue);
    const monthName = new Date(2023, monthIndex, 1).toLocaleDateString('en-US', { month: 'long' });
    return `${monthName} 1-30, 2023`;
  }
  
  getMonthIndex(monthValue: string): number {
    // Extract month index from value (e.g., 'june-2023' -> 5)
    const monthMap: {[key: string]: number} = {
      'march-2023': 2,
      'april-2023': 3,
      'may-2023': 4,
      'june-2023': 5
    };
    return monthMap[monthValue] || 0;
  }
  
  calculateNetPay(): number {
    const earnings = this.payslipItems
      .filter(item => item.type === 'earning')
      .reduce((sum, item) => sum + item.amount, 0);
      
    const deductions = this.payslipItems
      .filter(item => item.type === 'deduction')
      .reduce((sum, item) => sum + item.amount, 0);
      
    return earnings - deductions;
  }
  
  // Salary Breakdown Methods
  updateSalaryBreakdown() {
    // In a real app, would fetch data based on selected period
    console.log('Updating salary breakdown for period:', this.salaryPeriod);
  }
  
  calculateNetSalary(): number {
    const earnings = this.salaryBreakdown
      .filter(item => item.type === 'Earnings')
      .reduce((sum, item) => sum + item.amount, 0);
      
    const deductions = this.salaryBreakdown
      .filter(item => item.type === 'Deductions')
      .reduce((sum, item) => sum + item.amount, 0);
      
    return earnings - deductions;
  }
  
  // Tax Deductions Methods
  updateTaxDeductions() {
    // In a real app, would fetch data based on selected year
    console.log('Updating tax deductions for year:', this.taxYear);
  }
  
  // Reimbursements Methods
  requestReimbursement() {
    alert('Opening reimbursement request form');
    // In a real app, would show a modal form
  }
}
