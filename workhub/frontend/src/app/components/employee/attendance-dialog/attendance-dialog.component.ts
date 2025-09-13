import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-attendance-dialog',
  standalone: false,
  templateUrl: './attendance-dialog.component.html',
  styleUrl: './attendance-dialog.component.css'
})
export class AttendanceDialogComponent {
  attendanceForm: FormGroup;
  currentStatus: string = 'Check In'; // Default to Check In

  constructor(
    public dialogRef: MatDialogRef<AttendanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.attendanceForm = this.fb.group({
      employeeId: [data.employeeId, Validators.required],
      type: ['checkin', Validators.required],
      timestamp: [new Date(), Validators.required],
      location: ['', Validators.required],
      notes: ['']
    });
  }

  toggleStatus() {
    this.currentStatus = this.currentStatus === 'Check In' ? 'Check Out' : 'Check In';
    this.attendanceForm.patchValue({
      type: this.currentStatus === 'Check In' ? 'checkin' : 'checkout'
    });
  }

  onSubmit(): void {
    if (this.attendanceForm.valid) {
      this.dialogRef.close(this.attendanceForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}


