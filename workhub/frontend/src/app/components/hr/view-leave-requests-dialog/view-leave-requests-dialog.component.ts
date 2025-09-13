import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-view-leave-requests-dialog',
  standalone: false,
  templateUrl: './view-leave-requests-dialog.component.html',
  styleUrl: './view-leave-requests-dialog.component.css'
})
export class ViewLeaveRequestsDialogComponent {
  displayedColumns: string[] = ['name', 'type', 'dates', 'status', 'actions'];

  constructor(
    public dialogRef: MatDialogRef<ViewLeaveRequestsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onApprove(id: string): void {
    this.dialogRef.close({ action: 'approve', id });
  }

  onReject(id: string): void {
    this.dialogRef.close({ action: 'reject', id });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
