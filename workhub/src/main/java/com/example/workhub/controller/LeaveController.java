package com.example.workhub.controller;

import com.example.workhub.dto.LeaveBalanceDto;
import com.example.workhub.dto.LeaveRequestDto;
import com.example.workhub.service.LeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/leave")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;

    @GetMapping("/balance/{userId}")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<LeaveBalanceDto> getLeaveBalance(@PathVariable Long userId) {
        LeaveBalanceDto balance = leaveService.getLeaveBalance(userId);
        return ResponseEntity.ok(balance);
    }

    @PostMapping("/request")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<String> submitLeaveRequest(@RequestBody LeaveRequestDto requestDto) {
        leaveService.submitLeaveRequest(requestDto);
        return ResponseEntity.ok("Leave request submitted successfully");
    }
}