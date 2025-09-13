package com.example.workhub.service;

import com.example.workhub.dto.AttendanceDto;

import java.util.List;

public interface AttendanceService {
    AttendanceDto getTodayAttendance(Long userId);

    AttendanceDto clockIn(AttendanceDto dto);

    List<AttendanceDto> getAttendanceHistory(Long userId);

    AttendanceDto clockOutByUserId(Long userId);
}
