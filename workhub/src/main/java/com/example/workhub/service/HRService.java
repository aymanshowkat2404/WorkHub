// HRService.java
package com.example.workhub.service;

import com.example.workhub.dto.*;

import java.time.LocalDate;
import java.util.List;

public interface HRService {
    HRDashboardStatsDto getDashboardStats();
    List<LeaveRequestDto> getPendingLeaveRequests();
    void approveLeaveRequest(Long requestId);
    void rejectLeaveRequest(Long requestId);
    List<EmployeeDto> getAllEmployees(String department, String position);
    EmployeeDto addEmployee(CreateEmployeeDto dto);
    List<AttendanceDto> getAttendanceRecords(LocalDate date, Long employeeId);
    List<AnnouncementDto> getRecentAnnouncements();
    AnnouncementDto createAnnouncement(CreateAnnouncementDto dto);
    List<NotificationDto> getUnreadNotifications();
    void markAllNotificationsAsRead();
    List<EventDto> getUpcomingEvents();
    EventDto addEvent(CreateEventDto dto);
    List<EmployeeDto> getUpcomingBirthdays();
    EmployeeDto getEmployeeById(Long id);
}