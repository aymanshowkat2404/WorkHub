package com.example.workhub.service;

import com.example.workhub.dto.LeaveBalanceDto;
import com.example.workhub.dto.LeaveRequestDto;

public interface LeaveService {
    LeaveBalanceDto getLeaveBalance(Long userId);
    void submitLeaveRequest(LeaveRequestDto requestDto);
}
