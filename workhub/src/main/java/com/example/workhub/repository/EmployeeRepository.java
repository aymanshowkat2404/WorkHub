package com.example.workhub.repository;
import com.example.workhub.model.Employee;
import com.example.workhub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // Check if email already exists
    boolean existsByEmail(String email);
    
    // Find employee by email
    Optional<Employee> findByEmail(String email);
    
    // Find all employees with their creator information
    @Query("SELECT e FROM Employee e LEFT JOIN FETCH e.createdBy")
    List<Employee> findAllWithCreator();
    
    // Find employees by department
    List<Employee> findByDepartment(String department);
    
    // Find employees by position
    List<Employee> findByPosition(String position);
    
    // Find active employees
    List<Employee> findByStatus(String status);
    
    // Find employees created by a specific user
    List<Employee> findByCreatedBy(User createdBy);
    
    // Custom query for employees with salary range
    @Query("SELECT e FROM Employee e WHERE e.salary BETWEEN :minSalary AND :maxSalary")
    List<Employee> findEmployeesBySalaryRange(Double minSalary, Double maxSalary);
    
    // Custom query for searching employees
    @Query("SELECT e FROM Employee e WHERE " +
           "LOWER(e.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.email) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Employee> searchEmployees(String query);

    List<Employee> findByDateOfBirthBetween(LocalDate today, LocalDate endDate);

   

    @Query("SELECT COUNT(e) FROM Employee e")
    int countTotalEmployees();
    int countByIsActiveTrue();

    @Query("SELECT COUNT(e) FROM Employee e WHERE e.status = 'ACTIVE'")
     int countActiveEmployees();

    @Query("SELECT COUNT(e) FROM Employee e WHERE e.status = 'RESIGNED' AND e.hireDate BETWEEN :start AND :end")
    int countResignedThisMonth(LocalDate start, LocalDate end);

    @Query("SELECT COUNT(e) FROM Employee e WHERE e.isActive = true AND e.dateOfBirth BETWEEN :startDate AND :endDate")
    int countUpcomingBirthdays(LocalDate startDate, LocalDate endDate);
    
    List<Employee> findByDepartmentAndPosition(String department, String position);
      Employee findTopByOrderByEmployeeCodeDesc();


}