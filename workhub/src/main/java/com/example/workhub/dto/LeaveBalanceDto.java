package com.example.workhub.dto;

import lombok.Data;

@Data
public class LeaveBalanceDto {
    private Long employeeId;
    private int totalLeaves;
    private int usedLeaves;
    private int remainingLeaves;
}
