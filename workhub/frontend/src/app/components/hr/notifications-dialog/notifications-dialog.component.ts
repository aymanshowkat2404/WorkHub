import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-notifications-dialog',
  standalone: false,
  templateUrl: './notifications-dialog.component.html',
  styleUrl: './notifications-dialog.component.css'
})
export class NotificationsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<NotificationsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  markAllAsRead(): void {
    this.dialogRef.close('marked-read');
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
