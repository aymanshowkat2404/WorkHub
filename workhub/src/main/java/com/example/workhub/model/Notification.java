package com.example.workhub.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String message;
    
    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;
    
    private boolean isRead = false;
    private LocalDate createdAt = LocalDate.now();
}