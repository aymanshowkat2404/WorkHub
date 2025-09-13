import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-leave-request-dialog',
  standalone: false,
  templateUrl: './leave-request-dialog.component.html',
  styleUrl: './leave-request-dialog.component.css'
})
export class LeaveRequestDialogComponent {
  leaveForm: FormGroup;
  leaveTypes = ['Sick Leave', 'Vacation', 'Personal', 'Maternity/Paternity', 'Bereavement'];

  constructor(
    public dialogRef: MatDialogRef<LeaveRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.leaveForm = this.fb.group({
      employeeId: [data.employeeId, Validators.required],
      employeeName: [data.employeeName, Validators.required],
      leaveType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(10)]],
      contactInfo: ['', Validators.required],
      status: ['Pending']
    });
  }

  onSubmit(): void {
    if (this.leaveForm.valid) {
      this.dialogRef.close(this.leaveForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
