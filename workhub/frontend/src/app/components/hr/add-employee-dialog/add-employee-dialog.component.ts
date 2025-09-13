import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-employee-dialog',
  standalone:false,
  templateUrl: './add-employee-dialog.component.html',
  styleUrls: ['./add-employee-dialog.component.css'],
})
export class AddEmployeeDialogComponent {
  employeeForm: FormGroup;
  departments: string[];
  roles: string[];
  selectedFile: File | null = null;
  uploadInProgress = false;
  activeTab: number = 0;  // 0 = single, 1 = bulk

  constructor(
    public dialogRef: MatDialogRef<AddEmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {
    this.departments = data.departments || [];
    this.roles = data.roles || ['Employee', 'Manager', 'Admin'];

    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      department: ['', Validators.required],
      role: ['Employee', Validators.required],
      position: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(0)]],
      hireDate: [new Date(), Validators.required]
    });
  }

  onFileSelected(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const validExtensions = ['.csv', '.xlsx', '.xls'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

      if (validExtensions.includes(fileExtension)) {
        this.selectedFile = file;
        this.snackBar.open(`File selected: ${file.name}`, 'Close', { duration: 2000 });
      } else {
        this.snackBar.open('Please upload a valid CSV or Excel file', 'Close', { duration: 3000 });
        this.selectedFile = null;
        input.value = ''; // Clear the file input
      }
    }
  }

  onBulkUpload(): void {
    if (!this.selectedFile) {
      this.snackBar.open('Please select a file first', 'Close', { duration: 3000 });
      return;
    }

    this.uploadInProgress = true;
    
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post('http://localhost:8080/api/employees/bulk', formData).subscribe({
      next: (res) => {
        this.snackBar.open('Employees uploaded successfully!', 'Close', { duration: 3000 });
        this.dialogRef.close({ success: true, type: 'bulk' });
      },
      error: (err) => {
        console.error('Error uploading employees:', err);
        this.snackBar.open('Error uploading employees', 'Close', { duration: 3000 });
        this.uploadInProgress = false;
      },
      complete: () => {
        this.uploadInProgress = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      // Highlight invalid fields
      this.employeeForm.markAllAsTouched();
      this.snackBar.open('Please fill all required fields correctly', 'Close', { duration: 3000 });
      return;
    }

    const employeeData = this.employeeForm.value;
    console.log('Submitting employee:', employeeData);

    this.http.post('http://localhost:8080/api/employees', employeeData).subscribe({
      next: (res) => {
        this.snackBar.open('Employee added successfully!', 'Close', { duration: 3000 });
        this.dialogRef.close({ success: true, type: 'single', data: res });
      },
      error: (err) => {
        console.error('Error adding employee:', err);
        let errorMessage = 'Error adding employee';
        if (err.error?.message) {
          errorMessage = err.error.message;
        } else if (err.status === 409) {
          errorMessage = 'Employee with this email already exists';
        }
        this.snackBar.open(errorMessage, 'Close', { duration: 3000 });
      }
    });
  }

  downloadTemplate(event: Event): void {
    event.preventDefault();
    
    this.http.get('http://localhost:8080/api/employees/template', { 
      responseType: 'blob' 
    }).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'employee_template.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, err => {
      console.error('Error downloading template:', err);
      this.snackBar.open('Error downloading template', 'Close', { duration: 3000 });
    });
  }
}