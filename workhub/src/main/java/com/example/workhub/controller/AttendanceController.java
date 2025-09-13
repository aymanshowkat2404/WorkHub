package com.example.workhub.controller;

import com.example.workhub.dto.AttendanceDto;
import com.example.workhub.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/clock-in")
    public AttendanceDto clockIn(@RequestBody AttendanceDto dto) {
        return attendanceService.clockIn(dto);
    }

    @PostMapping("/clock-out/{userId}")
    public AttendanceDto clockOut(@PathVariable Long userId) {
        return attendanceService.clockOutByUserId(userId);
    }

    @GetMapping("/today/{userId}")
public ResponseEntity<AttendanceDto> getTodayAttendance(@PathVariable Long userId) {
    AttendanceDto dto = attendanceService.getTodayAttendance(userId);
    if (dto == null) {
        return ResponseEntity.ok(null); 
    }
    return ResponseEntity.ok(dto);
}


    @GetMapping("/history/{userId}")
    public List<AttendanceDto> getAttendanceHistory(@PathVariable Long userId) {
        return attendanceService.getAttendanceHistory(userId);
    }
}

