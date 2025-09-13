package com.example.workhub.repository;

import com.example.workhub.model.Attendance;
import com.example.workhub.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    // 🔹 Basic finds
    List<Attendance> findByDate(LocalDate date);
    List<Attendance> findByUserId(Long employeeId);
    List<Attendance> findByDateAndUserId(LocalDate date, Long employeeId);
    List<Attendance> findByUserIdOrderByDateDesc(Long userId);

    // 🔹 Date range queries
    List<Attendance> findByDateBetween(LocalDate startDate, LocalDate endDate);
    List<Attendance> findByUserIdAndDateBetween(Long employeeId, LocalDate startDate, LocalDate endDate);

    // 🔹 Status-based queries
    List<Attendance> findByStatus(String status);
    List<Attendance> findByUserIdAndStatus(Long employeeId, String status);
    List<Attendance> findByDateAndStatus(LocalDate date, String status);
    List<Attendance> findByDateBetweenAndStatus(LocalDate startDate, LocalDate endDate, String status);
    boolean existsByDateAndUserId(LocalDate date, Long userId);


    // 🔹 Custom queries
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.date = CURRENT_DATE")
    int countActiveEmployeesToday();

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.date = :date")
    int countActiveEmployeesByDate(LocalDate date);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.date = :date AND a.status = :status")
    int countByDateAndStatus(LocalDate date, String status);

    @Query("SELECT a FROM Attendance a WHERE a.user.id = :employeeId ORDER BY a.date DESC")
    List<Attendance> findRecentAttendancesByUser(Long employeeId);

    @Query("SELECT DISTINCT a.date FROM Attendance a WHERE a.user.id = :employeeId ORDER BY a.date DESC")
    List<LocalDate> findDistinctDatesByUser(Long employeeId);

    Optional<Attendance> findByUserAndDate(User user, LocalDate date);

}
