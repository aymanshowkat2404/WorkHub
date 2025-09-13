package com.example.workhub.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "leave_types")
public class LeaveType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String name;
    
    private String description;
    private int maxDaysPerYear;
}