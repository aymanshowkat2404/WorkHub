package com.example.workhub.dto;

import java.time.LocalDate;

public record AttendanceDto(
    Long id,
    String employeeName,
    LocalDate date,
    String checkIn,
    String checkOut,
    String status,
    String notes,
    Long userId,
    String hoursWorked 
) {}
