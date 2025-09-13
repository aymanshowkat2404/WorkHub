import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-payslip-dialog',
  standalone: false,
  templateUrl: './payslip-dialog.component.html',
  styleUrl: './payslip-dialog.component.css'
})
export class PayslipDialogComponent {
  payslipForm: FormGroup;
  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  years: number[] = [];
  selectedPayslip: any = null;

  constructor(
    public dialogRef: MatDialogRef<PayslipDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    // Generate years (current year and 2 previous)
    const currentYear = new Date().getFullYear();
    this.years = [currentYear, currentYear - 1, currentYear - 2];

    this.payslipForm = this.fb.group({
      employeeId: [data.employeeId],
      month: [data.month],
      year: [data.year]
    });
  }

  loadPayslip(): void {
    if (this.payslipForm.valid) {
      // Here you would typically call a service to get the payslip
      // For demo purposes, we'll just create a mock payslip
      const formValue = this.payslipForm.value;
      this.selectedPayslip = {
        employeeId: formValue.employeeId,
        month: this.months[formValue.month - 1],
        year: formValue.year,
        basicSalary: 5000,
        allowances: 1500,
        deductions: 800,
        netSalary: 5700,
        paymentDate: `${formValue.year}-${formValue.month.toString().padStart(2, '0')}-28`
      };
    }
  }

  downloadPayslip(): void {
    // Implement download functionality
    console.log('Downloading payslip:', this.selectedPayslip);
  }

  emailPayslip(): void {
    // Implement email functionality
    console.log('Emailing payslip:', this.selectedPayslip);
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
