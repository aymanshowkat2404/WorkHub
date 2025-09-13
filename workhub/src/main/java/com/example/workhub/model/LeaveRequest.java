package com.example.workhub.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "leave_requests")
public class LeaveRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;
    
    @ManyToOne
    @JoinColumn(name = "leave_type_id", nullable = false)
    private LeaveType leaveType;
    
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
    private String status = "PENDING"; // PENDING, APPROVED, REJECTED
    
    @Column(updatable = false)
    private LocalDate requestDate = LocalDate.now();
}