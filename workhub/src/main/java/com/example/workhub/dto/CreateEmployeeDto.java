package com.example.workhub.dto;

import java.time.LocalDate;

public record CreateEmployeeDto(
    String firstName,
    String lastName,
    String email,
    String department,
    String position,
    LocalDate hireDate,
    String password
) {}