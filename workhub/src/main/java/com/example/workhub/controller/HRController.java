package com.example.workhub.controller;

import com.example.workhub.dto.*;
import com.example.workhub.service.HRService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/hr")
@PreAuthorize("hasRole('HR')")
public class HRController {

    private final HRService hrService;

    @Autowired
    public HRController(HRService hrService) {
        this.hrService = hrService;
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<HRDashboardStatsDto> getDashboardStats() {
        HRDashboardStatsDto stats = hrService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/leave-requests/pending")
    public ResponseEntity<List<LeaveRequestDto>> getPendingLeaveRequests() {
        List<LeaveRequestDto> requests = hrService.getPendingLeaveRequests();
        return ResponseEntity.ok(requests);
    }

    @PatchMapping("/leave-requests/{requestId}/approve")
    public ResponseEntity<Void> approveLeaveRequest(@PathVariable Long requestId) {
        hrService.approveLeaveRequest(requestId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/leave-requests/{requestId}/reject")
    public ResponseEntity<Void> rejectLeaveRequest(@PathVariable Long requestId) {
        hrService.rejectLeaveRequest(requestId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/employees")
public ResponseEntity<List<EmployeeDto>> getAllEmployees(
        @RequestParam(required = false) String department,
        @RequestParam(required = false) String position) {
    List<EmployeeDto> employees = hrService.getAllEmployees(department, position);
    return ResponseEntity.ok(employees);
}

@PostMapping("/employees")
public ResponseEntity<EmployeeDto> addEmployee(@RequestBody CreateEmployeeDto employeeDto) {
    EmployeeDto newEmployee = hrService.addEmployee(employeeDto);
    return ResponseEntity.ok(newEmployee);
}


    @GetMapping("/attendance")
    public ResponseEntity<List<AttendanceDto>> getAttendanceRecords(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Long employeeId) {
        List<AttendanceDto> records = hrService.getAttendanceRecords(date, employeeId);
        return ResponseEntity.ok(records);
    }

    @GetMapping("/announcements")
    public ResponseEntity<List<AnnouncementDto>> getRecentAnnouncements() {
        List<AnnouncementDto> announcements = hrService.getRecentAnnouncements();
        return ResponseEntity.ok(announcements);
    }

    @PostMapping("/announcements")
    public ResponseEntity<AnnouncementDto> createAnnouncement(@RequestBody CreateAnnouncementDto announcementDto) {
        AnnouncementDto newAnnouncement = hrService.createAnnouncement(announcementDto);
        return ResponseEntity.ok(newAnnouncement);
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationDto>> getUnreadNotifications() {
        List<NotificationDto> notifications = hrService.getUnreadNotifications();
        return ResponseEntity.ok(notifications);
    }

    @PatchMapping("/notifications/mark-all-read")
    public ResponseEntity<Void> markAllNotificationsAsRead() {
        hrService.markAllNotificationsAsRead();
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/upcoming-events")
    public ResponseEntity<List<EventDto>> getUpcomingEvents() {
        List<EventDto> events = hrService.getUpcomingEvents();
        return ResponseEntity.ok(events);
    }

    @PostMapping("/upcoming-events")
    public ResponseEntity<EventDto> addEvent(@RequestBody CreateEventDto eventDto) {
        EventDto newEvent = hrService.addEvent(eventDto);
        return ResponseEntity.ok(newEvent);
    }

    @GetMapping("/birthdays")
    public ResponseEntity<List<EmployeeDto>> getUpcomingBirthdays() {
        List<EmployeeDto> employees = hrService.getUpcomingBirthdays();
        return ResponseEntity.ok(employees);
    }
    @GetMapping("/profile/{id}")
     public ResponseEntity<EmployeeDto> getProfile(@PathVariable Long id) {
    EmployeeDto employee = hrService.getEmployeeById(id);
    return ResponseEntity.ok(employee);
}


    }
