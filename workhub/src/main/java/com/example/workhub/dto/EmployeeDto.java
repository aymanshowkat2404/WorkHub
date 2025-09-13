package com.example.workhub.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDto {
    private Long id;

    @NotBlank
    @Size(max = 50)
    private String firstName;

    @NotBlank
    @Size(max = 50)
    private String lastName;

    @NotBlank
    @Email
    @Size(max = 100)
    private String email;

    @Size(max = 20)
    private String phoneNumber;

    @Size(max = 50)
    private String department;

    @Size(max = 50)
    private String position;

    @Size(max = 20)
    private String role;

    @DecimalMin("0.00")
    private BigDecimal salary;

    private LocalDate hireDate;

    @Size(max = 20)
    private String status;

    private Long createdBy;

    private String avatarUrl; // Include this if needed
}
