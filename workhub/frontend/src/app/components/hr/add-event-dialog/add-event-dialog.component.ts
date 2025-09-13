import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-add-event-dialog',
  standalone: false,
  templateUrl: './add-event-dialog.component.html',
  styleUrl: './add-event-dialog.component.css'
})
export class AddEventDialogComponent {
  eventForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      date: [new Date(), Validators.required],
      time: ['10:00'],
      location: [''],
      isCompanyWide: [true]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      this.dialogRef.close(this.eventForm.value);
    }
  }
}