package com.example.workhub.repository;

import com.example.workhub.model.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByStatus(String status);
    
    @Query("SELECT COUNT(lr) FROM LeaveRequest lr WHERE lr.status = 'APPROVED' AND " +
           ":today BETWEEN lr.startDate AND lr.endDate")
    int countApprovedLeavesToday(@Param("today") LocalDate today);
}