import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-task-quick-add-dialog',
  standalone: false,
  templateUrl: './task-quick-add-dialog.component.html',
  styleUrl: './task-quick-add-dialog.component.css'
})
export class TaskQuickAddDialogComponent {
  taskForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<TaskQuickAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: [''],
      priority: ['medium']
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.dialogRef.close(this.taskForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
