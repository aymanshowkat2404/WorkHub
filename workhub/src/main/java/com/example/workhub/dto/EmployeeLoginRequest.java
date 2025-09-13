package com.example.workhub.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmployeeLoginRequest {
    @NotBlank
    private String employeeId;

    @NotBlank
    private String password;

    private final String loginType = "employee";
}

