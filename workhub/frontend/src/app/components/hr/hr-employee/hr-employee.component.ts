import { Component, OnInit } from '@angular/core';
interface Employee {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  department: string;
  position: string;
  manager: string;
  status: 'active' | 'inactive' | 'on_leave';
  photo?: string;
}

@Component({
  selector: 'app-hr-employee',
  standalone: false,
  templateUrl: './hr-employee.component.html',
  styleUrl: './hr-employee.component.css'
})
export class HrEmployeeComponent implements OnInit {

  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  selectedEmployee: Employee | null = null;
  
  // Search and filter
  searchQuery: string = '';
  departmentFilter: string = '';
  statusFilter: string = '';
  
  // Dropdown options
  departments: string[] = [];
  statuses = ['active', 'inactive', 'on_leave'];
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  ngOnInit(): void {
    this.loadSampleData();
  }

  loadSampleData(): void {
    // Sample data
    this.employees = [
      {
        id: 1,
        employeeId: 'EMP001',
        firstName: 'John',
        lastName: 'Doe',
        department: 'IT',
        position: 'Software Developer',
        manager: 'Jane Smith',
        status: 'active',
        photo: 'assets/images/default-avatar.png'
      },
      {
        id: 2,
        employeeId: 'EMP002',
        firstName: 'Jane',
        lastName: 'Smith',
        department: 'IT',
        position: 'IT Manager',
        manager: '',
        status: 'active'
      },
      {
        id: 3,
        employeeId: 'EMP003',
        firstName: 'Robert',
        lastName: 'Johnson',
        department: 'HR',
        position: 'HR Specialist',
        manager: 'Mike Johnson',
        status: 'active'
      },
      {
        id: 4,
        employeeId: 'EMP004',
        firstName: 'Emily',
        lastName: 'Williams',
        department: 'Marketing',
        position: 'Marketing Coordinator',
        manager: 'Sarah Brown',
        status: 'on_leave'
      },
      {
        id: 5,
        employeeId: 'EMP005',
        firstName: 'Michael',
        lastName: 'Brown',
        department: 'Finance',
        position: 'Financial Analyst',
        manager: 'David Wilson',
        status: 'inactive'
      }
    ];

    // Extract unique departments
    this.departments = [...new Set(this.employees.map(e => e.department))];
    this.filterEmployees();
  }

  filterEmployees(): void {
    this.filteredEmployees = this.employees.filter(employee => {
      const matchesSearch = 
        `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        employee.position.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesDepartment = 
        !this.departmentFilter || 
        employee.department === this.departmentFilter;
      
      const matchesStatus = 
        !this.statusFilter || 
        employee.status === this.statusFilter;
      
      return matchesSearch && matchesDepartment && matchesStatus;
    });
    
    this.currentPage = 1;
    this.calculatePagination();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
  }

  // Pagination controls
  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  // Employee actions
  openAddEmployeeModal(): void {
    this.selectedEmployee = {
      id: 0,
      employeeId: '',
      firstName: '',
      lastName: '',
      department: '',
      position: '',
      manager: '',
      status: 'active'
    };
    alert('Add employee functionality would go here');
  }

  editEmployee(id: number): void {
    this.selectedEmployee = this.employees.find(e => e.id === id) || null;
    alert(`Edit employee: ${this.selectedEmployee?.firstName} ${this.selectedEmployee?.lastName}`);
  }

  viewEmployeeDetails(id: number): void {
    const employee = this.employees.find(e => e.id === id);
    alert(`Viewing details for: ${employee?.firstName} ${employee?.lastName}`);
  }

  assignRole(employee: Employee): void {
    this.selectedEmployee = employee;
    alert(`Assigning role to: ${employee.firstName} ${employee.lastName}`);
  }

  terminateEmployee(employee: Employee): void {
    if (confirm(`Are you sure you want to terminate ${employee.firstName} ${employee.lastName}?`)) {
      employee.status = 'inactive';
      this.filterEmployees();
    }
  }

  generateIdCards(): void {
    alert('ID card generation would happen here');
  }

  // Helper methods
  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      case 'on_leave': return 'status-on-leave';
      default: return '';
    }
  }

  // The following methods are kept to match your template but won't be used without modals
  closeModal(): void {}
  closeRoleModal(): void {}
  closeTerminationModal(): void {}
  saveEmployee(employee: Employee): void {}
  saveEmployeeRole(updatedEmployee: Employee): void {}
  confirmTermination(terminationData: any): void {}
}


