package com.example.workhub.repository;

import com.example.workhub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmployeeId(String employeeId);
    Boolean existsByEmail(String email);

    Boolean existsByEmployeeId(String employeeId);  // New: for employee uniqueness check
}
