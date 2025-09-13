package com.example.workhub.dto;

import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String companyName;
    private String employeeId;
    private String photoUrl;
}
