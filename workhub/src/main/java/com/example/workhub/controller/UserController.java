package com.example.workhub.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.workhub.exception.ResourceNotFoundException;
import com.example.workhub.model.User;
import com.example.workhub.repository.UserRepository;
import com.example.workhub.security.UserPrincipal;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
    // 🔍 Debug logs to check what's coming from Spring Security
    System.out.println("UserPrincipal: " + userPrincipal);
    System.out.println("User ID from token: " + (userPrincipal != null ? userPrincipal.getId() : "null"));

    if (userPrincipal == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated.");
    }

    Long userId = userPrincipal.getId();
    if (userId == null) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User ID is missing from token.");
    }

    User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

            return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "userName", user.getFirstName() != null ? user.getFirstName() : "",
                "fullName", user.getLastName() != null ? user.getLastName() : "",
                "firstName", user.getFirstName() != null ? user.getFirstName() : "",
                "lastName", user.getLastName() != null ? user.getLastName() : "",
                "email", user.getEmail() != null ? user.getEmail() : "",
                "employeeId", user.getEmployeeId() != null ? user.getEmployeeId() : "",
                "photoUrl", user.getPhotoUrl() != null ? user.getPhotoUrl() : "",
                "companyName", user.getCompanyName() != null ? user.getCompanyName() : ""
            ));
            
}

}
