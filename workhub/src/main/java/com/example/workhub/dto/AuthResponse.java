package com.example.workhub.dto;

import lombok.Data;

import java.util.Set;

@Data
public class AuthResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private Long id;
    private String username;
    private String email;
    private Set<String> roles;
}
