package com.example.workhub.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class EmployeeRegisterRequest {

    @NotBlank
    private String employeeId;

    @NotBlank
    private String companyName;

    @NotBlank
    private String fullName;

    @NotBlank
    @Size(min = 6, max = 100)
    private String password;

    @NotBlank
    @Email
    private String email;

    private MultipartFile photo; // Optional: file upload
}
