package com.example.workhub.service;

import com.example.workhub.dto.LeaveBalanceDto;
import com.example.workhub.dto.LeaveRequestDto;
import com.example.workhub.model.Employee;
import com.example.workhub.model.LeaveRequest;
import com.example.workhub.model.LeaveType;
import com.example.workhub.repository.EmployeeRepository;
import com.example.workhub.repository.LeaveRequestRepository;
import com.example.workhub.repository.LeaveTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class LeaveServiceImpl implements LeaveService {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private LeaveTypeRepository leaveTypeRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public LeaveBalanceDto getLeaveBalance(Long userId) {
        // TODO: implement balance calculation logic
        return new LeaveBalanceDto(/* fill your fields */);
    }

    @Override
    public void submitLeaveRequest(LeaveRequestDto dto) {
        // 1. Find employee
        Employee employee = employeeRepository.findById(dto.employeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // 2. Find leave type (maps String → FK id)
        LeaveType leaveType = leaveTypeRepository.findByName(dto.leaveType())
                .orElseThrow(() -> new RuntimeException("Invalid leave type: " + dto.leaveType()));

        // 3. Build entity
        LeaveRequest request = new LeaveRequest();
        request.setEmployee(employee);
        request.setLeaveType(leaveType);
        request.setStartDate(dto.startDate());
        request.setEndDate(dto.endDate());
        request.setReason(dto.reason());
        request.setStatus("PENDING");
        request.setRequestDate(LocalDate.now());

        // 4. Save
        leaveRequestRepository.save(request);
    }
}
