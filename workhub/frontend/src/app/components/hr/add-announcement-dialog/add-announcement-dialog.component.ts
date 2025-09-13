import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-announcement-dialog',
  standalone: false,
  templateUrl: './add-announcement-dialog.component.html',
  styleUrl: './add-announcement-dialog.component.css'
})
export class AddAnnouncementDialogComponent {
  announcementForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddAnnouncementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.announcementForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      isImportant: [false],
      targetDepartments: [[]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.announcementForm.valid) {
      const announcement = {
        ...this.announcementForm.value,
        postedBy: this.data.currentUser.username,
        postedDate: new Date().toISOString()
      };
      this.dialogRef.close(announcement);
    }
  }
}