package com.example.workhub.controller;

import com.example.workhub.dto.BulkUploadResult;
import com.example.workhub.dto.EmployeeDto;
import com.example.workhub.security.UserPrincipal;
import com.example.workhub.service.EmployeeService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/employees")  
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    // EMPLOYEE dashboard view
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<String> employeeDashboard() {
        return ResponseEntity.ok("Welcome to Employee Dashboard");
    }

    // Create employee (HR only)
    @PostMapping
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<EmployeeDto> createEmployee(
            @Valid @RequestBody EmployeeDto employeeDto,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal.getId(); // Can be used if needed for HR ID
        EmployeeDto createdEmployee = employeeService.createEmployee(employeeDto);
        return new ResponseEntity<>(createdEmployee, HttpStatus.CREATED);
    }

    // Bulk Upload (HR only)
    @PostMapping("/bulk")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<BulkUploadResult> createEmployeesFromFile(
            @RequestParam("file") MultipartFile file) {
        BulkUploadResult result = employeeService.processBulkUpload(file);
        return ResponseEntity.ok(result);
    }

    // Download Excel template (HR only)
    @GetMapping("/template")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<byte[]> downloadEmployeeTemplate() {
        byte[] template = employeeService.generateEmployeeTemplate();
        return ResponseEntity.ok()
                .header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                .header("Content-Disposition", "attachment; filename=employee_template.xlsx")
                .body(template);
    }

    // Get all employees (HR + MANAGER)
    @GetMapping
    @PreAuthorize("hasAnyRole('HR', 'MANAGER')")
    public ResponseEntity<List<EmployeeDto>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    // Get employee by ID (HR or the actual employee)
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('HR') or @employeeSecurity.isEmployeeOwner(authentication, #id)")
    public ResponseEntity<EmployeeDto> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    // Update employee (HR only)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<EmployeeDto> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeDto employeeDto) {
        return ResponseEntity.ok(employeeService.updateEmployee(id, employeeDto));
    }

    // Delete employee (HR only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }
 
    // Employee self-update (limited fields)
@PutMapping("/{id}/profile")
@PreAuthorize("@employeeSecurity.isEmployeeOwner(authentication, #id)")
public ResponseEntity<EmployeeDto> updateOwnProfile(
        @PathVariable Long id,
        @Valid @RequestBody EmployeeDto employeeDto) {
    return ResponseEntity.ok(employeeService.updateEmployee(id, employeeDto));
}

}
