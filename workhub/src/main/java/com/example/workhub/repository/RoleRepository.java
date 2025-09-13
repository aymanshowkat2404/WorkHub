package com.example.workhub.repository;

import com.example.workhub.model.Role;
import com.example.workhub.model.ERole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByName(ERole name);
}
