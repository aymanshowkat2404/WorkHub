package com.example.workhub.service;

import com.example.workhub.dto.*;
import com.example.workhub.model.*;
import com.example.workhub.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HRServiceImpl implements HRService {

    private final EmployeeRepository employeeRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final AttendanceRepository attendanceRepository;
    private final AnnouncementRepository announcementRepository;
    private final NotificationRepository notificationRepository;
    private final EventRepository eventRepository;

    @Autowired
    public HRServiceImpl(EmployeeRepository employeeRepository,
                        LeaveRequestRepository leaveRequestRepository,
                        AttendanceRepository attendanceRepository,
                        AnnouncementRepository announcementRepository,
                        NotificationRepository notificationRepository,
                        EventRepository eventRepository) {
        this.employeeRepository = employeeRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.attendanceRepository = attendanceRepository;
        this.announcementRepository = announcementRepository;
        this.notificationRepository = notificationRepository;
        this.eventRepository = eventRepository;
    }

    @Override
    public HRDashboardStatsDto getDashboardStats(){
    try {
        int totalEmployees = employeeRepository.countTotalEmployees();
        int activeEmployees = attendanceRepository.countActiveEmployeesToday();
        int onLeaveToday = leaveRequestRepository.countApprovedLeavesToday(LocalDate.now());
        int resignedThisMonth = employeeRepository.countResignedThisMonth(
            LocalDate.now().withDayOfMonth(1),
            LocalDate.now()
        );

        LocalDate today = LocalDate.now();
LocalDate next30Days = today.plusDays(30);
int upcomingBirthdays = employeeRepository.countUpcomingBirthdays(today, next30Days);


        return new HRDashboardStatsDto(
            totalEmployees,
            activeEmployees,
            onLeaveToday,
            resignedThisMonth,
            upcomingBirthdays
        );
    }
    catch (Exception e) {
        e.printStackTrace(); // ✅ Logs real error
        throw new RuntimeException("Error while fetching dashboard stats", e);
    }
}

    @Override
    public List<LeaveRequestDto> getPendingLeaveRequests() {
        return leaveRequestRepository.findByStatus("PENDING").stream()
            .map(this::convertToLeaveRequestDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void approveLeaveRequest(Long requestId) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Leave request not found"));
        leaveRequest.setStatus("APPROVED");
        leaveRequestRepository.save(leaveRequest);
    }

    @Override
    @Transactional
    public void rejectLeaveRequest(Long requestId) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Leave request not found"));
        leaveRequest.setStatus("REJECTED");
        leaveRequestRepository.save(leaveRequest);
    }

    @Override
    public List<EmployeeDto> getAllEmployees(String department, String position) {
        List<Employee> employees;
        if (department != null && position != null) {
            employees = employeeRepository.findByDepartmentAndPosition(department, position);
        } else if (department != null) {
            employees = employeeRepository.findByDepartment(department);
        } else if (position != null) {
            employees = employeeRepository.findByPosition(position);
        } else {
            employees = employeeRepository.findAll();
        }
        
        return employees.stream()
            .map(this::convertToEmployeeDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EmployeeDto addEmployee(CreateEmployeeDto employeeDto) {
        Employee employee = new Employee();
        employee.setFirstName(employeeDto.firstName());
        employee.setLastName(employeeDto.lastName());
        employee.setEmail(employeeDto.email());
        employee.setDepartment(employeeDto.department());
        employee.setPosition(employeeDto.position());
        employee.setHireDate(employeeDto.hireDate());
        employee.setActive(true);
        
        // Generate employee code (e.g., EMP001)
        String lastEmployeeCode = Optional.ofNullable(employeeRepository.findTopByOrderByEmployeeCodeDesc())
        .map(Employee::getEmployeeCode)
        .orElse("EMP000");
    
        String newEmployeeCode = "EMP" + String.format("%03d", 
            Integer.parseInt(lastEmployeeCode.substring(3)) + 1);
        employee.setEmployeeCode(newEmployeeCode);
        
        Employee savedEmployee = employeeRepository.save(employee);
        return convertToEmployeeDto(savedEmployee);
    }

    @Override
    public List<AttendanceDto> getAttendanceRecords(LocalDate date, Long employeeId) {
        List<Attendance> attendances;
        if (date != null && employeeId != null) {
            attendances = attendanceRepository.findByDateAndUserId(date, employeeId);
        } else if (date != null) {
            attendances = attendanceRepository.findByDate(date);
        } else if (employeeId != null) {
            attendances = attendanceRepository.findByUserId(employeeId);
        } else {
            attendances = attendanceRepository.findAll();
        }
        
        return attendances.stream()
            .map(this::convertToAttendanceDto)
            .collect(Collectors.toList());
    }

    @Override
    public List<AnnouncementDto> getRecentAnnouncements() {
        return announcementRepository.findTop10ByOrderByPostedDateDesc().stream()
            .map(this::convertToAnnouncementDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AnnouncementDto createAnnouncement(CreateAnnouncementDto announcementDto) {
        Announcement announcement = new Announcement();
        announcement.setTitle(announcementDto.title());
        announcement.setContent(announcementDto.content());
        announcement.setPostedBy("HR");
        announcement.setPostedDate(LocalDate.now());
        announcement.setPinned(announcementDto.isPinned());
        
        Announcement savedAnnouncement = announcementRepository.save(announcement);
        return convertToAnnouncementDto(savedAnnouncement);
    }

    @Override
    public List<NotificationDto> getUnreadNotifications() {
        return notificationRepository.findByIsReadFalseOrderByCreatedAtDesc().stream()
            .map(this::convertToNotificationDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void markAllNotificationsAsRead() {
        notificationRepository.markAllAsRead();
    }

    @Override
    public List<EventDto> getUpcomingEvents() {
        return eventRepository.findByEventDateGreaterThanEqualOrderByEventDateAsc(LocalDate.now()).stream()
            .map(this::convertToEventDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EventDto addEvent(CreateEventDto eventDto) {
        Event event = new Event();
        event.setTitle(eventDto.title());
        event.setDescription(eventDto.description());
        event.setEventDate(eventDto.eventDate());
        event.setOrganizer("HR");
        
        Event savedEvent = eventRepository.save(event);
        return convertToEventDto(savedEvent);
    }

    @Override
    public List<EmployeeDto> getUpcomingBirthdays() {
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(30);
        
        return employeeRepository.findByDateOfBirthBetween(today, endDate).stream()
            .map(this::convertToEmployeeDto)
            .collect(Collectors.toList());
    }

    // Helper conversion methods
    private LeaveRequestDto convertToLeaveRequestDto(LeaveRequest leaveRequest) {
        return new LeaveRequestDto(
            leaveRequest.getId(),
            leaveRequest.getEmployee().getFirstName() + " " + leaveRequest.getEmployee().getLastName(),
            leaveRequest.getLeaveType().getName(),
            leaveRequest.getStartDate(),
            leaveRequest.getEndDate(),
            leaveRequest.getStatus(),
            leaveRequest.getReason()
        );
    }

    private EmployeeDto convertToEmployeeDto(Employee employee) {
        return EmployeeDto.builder()
            .id(employee.getId())
            .firstName(employee.getFirstName())
            .lastName(employee.getLastName())
            .email(employee.getEmail())
            .department(employee.getDepartment())
            .position(employee.getPosition())
            .hireDate(employee.getHireDate())
            .avatarUrl(employee.getAvatarUrl())
            .build();
    }
    
    
    

    private AttendanceDto convertToAttendanceDto(Attendance attendance) {
        String worked = null;
        if (attendance.getCheckIn() != null && attendance.getCheckOut() != null) {
            var duration = java.time.Duration.between(attendance.getCheckIn(), attendance.getCheckOut());
            long hours = duration.toHours();
            long minutes = duration.toMinutesPart();
            worked = hours + "h " + minutes + "m";
        }
    
        return new AttendanceDto(
            attendance.getId(),
            attendance.getUser().getFirstName() + " " + attendance.getUser().getLastName(),
            attendance.getDate(),
            attendance.getCheckIn() != null ? attendance.getCheckIn().toString() : null,
            attendance.getCheckOut() != null ? attendance.getCheckOut().toString() : null,
            attendance.getStatus(),
            attendance.getNotes(),
            attendance.getUser().getId(),
            worked // ✅ now included in DTO
        );
    }
    

    private AnnouncementDto convertToAnnouncementDto(Announcement announcement) {
        return new AnnouncementDto(
            announcement.getId(),
            announcement.getTitle(),
            announcement.getContent(),
            announcement.getPostedBy(),
            announcement.getPostedDate(),
            announcement.isPinned()
        );
    }

    private NotificationDto convertToNotificationDto(Notification notification) {
        return new NotificationDto(
            notification.getId(),
            notification.getTitle(),
            notification.getMessage(),
            notification.getCreatedAt(),
            notification.isRead()
        );
    }

    private EventDto convertToEventDto(Event event) {
        return new EventDto(
            event.getId(),
            event.getTitle(),
            event.getDescription(),
            event.getEventDate(),
            event.getOrganizer()
        );
    }

    @Override
    public EmployeeDto getEmployeeById(Long id) {
    Employee employee = employeeRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
    return convertToEmployeeDto(employee);
}
 
}