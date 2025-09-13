package com.example.workhub.service;

import com.example.workhub.dto.AttendanceDto;
import com.example.workhub.exception.ResourceNotFoundException;
import com.example.workhub.model.Attendance;
import com.example.workhub.model.User;
import com.example.workhub.repository.AttendanceRepository;
import com.example.workhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;

    @Override
    public AttendanceDto getTodayAttendance(Long userId) {
        Attendance attendance = attendanceRepository.findByDateAndUserId(LocalDate.now(), userId)
                .stream()
                .findFirst()
                .orElse(null);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        return mapToDto(attendance, user); // returns null values if attendance is null
    }

    @Override
    public AttendanceDto clockIn(AttendanceDto dto) {
        User user = userRepository.findById(dto.userId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", dto.userId()));

        // Prevent duplicate clock-in for today
        boolean alreadyExists = attendanceRepository.existsByDateAndUserId(LocalDate.now(), user.getId());
        if (alreadyExists) {
            throw new IllegalStateException("You have already clocked in today.");
        }

        Attendance attendance = new Attendance();
        attendance.setUser(user);
        attendance.setDate(LocalDate.now());
        attendance.setCheckIn(LocalTime.now());

        System.out.println("Saving attendance for user " + user.getId() + " on " + LocalDate.now());

        Attendance saved = attendanceRepository.save(attendance);
        return mapToDto(saved, user);
    }

    @Override
    public AttendanceDto clockOutByUserId(Long userId) {
        Attendance attendance = attendanceRepository.findByDateAndUserId(LocalDate.now(), userId)
                .stream()
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("User has not clocked in today."));

        attendance.setCheckOut(LocalTime.now());

        if (attendance.getCheckIn() != null && attendance.getCheckOut() != null) {
            long hoursWorked = Duration.between(attendance.getCheckIn(), attendance.getCheckOut()).toHours();
            attendance.setHoursWorked(hoursWorked);
        }

        Attendance saved = attendanceRepository.save(attendance);
        return mapToDto(saved, attendance.getUser());
    }

    @Override
    public List<AttendanceDto> getAttendanceHistory(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        return attendanceRepository.findByUserIdOrderByDateDesc(userId)
                .stream()
                .map(a -> mapToDto(a, user))
                .toList();
    }

    private AttendanceDto mapToDto(Attendance attendance, User user) {
        if (attendance == null) {
            return new AttendanceDto(
                    null,
                    user.getFirstName() + " " + user.getLastName(),
                    null,
                    null,
                    null,
                    null,
                    null,
                    user.getId(),
                    null
            );
        }
    
        // Format hours/minutes nicely
        String worked = null;
        if (attendance.getCheckIn() != null && attendance.getCheckOut() != null) {
            Duration duration = Duration.between(attendance.getCheckIn(), attendance.getCheckOut());
            long hours = duration.toHours();
            long minutes = duration.toMinutesPart();
            worked = hours + "h " + minutes + "m";
        }
    
        return new AttendanceDto(
                attendance.getId(),
                user.getFirstName() + " " + user.getLastName(),
                attendance.getDate(),
                attendance.getCheckIn() != null ? attendance.getCheckIn().toString() : null,
                attendance.getCheckOut() != null ? attendance.getCheckOut().toString() : null,
                attendance.getStatus(),
                attendance.getNotes(),
                user.getId(),
                worked
        );
    }
    
}
