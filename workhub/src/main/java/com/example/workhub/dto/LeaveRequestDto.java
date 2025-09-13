package com.example.workhub.dto;

import java.time.LocalDate;

public record LeaveRequestDto(
    Long employeeId,
    String employeeName,
    String leaveType,
    LocalDate startDate,
    LocalDate endDate,
    String status,
    String reason
) {}