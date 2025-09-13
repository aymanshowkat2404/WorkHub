package com.example.workhub.controller;

import com.example.workhub.dto.EmployeeLoginRequest;
import com.example.workhub.dto.EmployeeRegisterRequest;
import com.example.workhub.dto.LoginRequest;
import com.example.workhub.dto.RegisterRequest;
import com.example.workhub.dto.UserDto;
import com.example.workhub.exception.InvalidRoleException;
import com.example.workhub.mapper.UserMapper;
import com.example.workhub.model.User;
import com.example.workhub.security.JwtProvider;
import com.example.workhub.security.UserPrincipal;
import com.example.workhub.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtProvider tokenProvider;
    private final UserService userService;
    private final UserMapper userMapper;

    
    @PostMapping("/login/hr")
    public ResponseEntity<?> loginHr(@Valid @RequestBody LoginRequest request) {
        return handleLogin(request.getUsername(), request.getPassword(), "hr");
    }

    
    @PostMapping("/login/employee")
    public ResponseEntity<?> loginEmployee(@Valid @RequestBody EmployeeLoginRequest request) {
        return handleLogin(request.getEmployeeId(), request.getPassword(), "employee");
    }


    private ResponseEntity<?> handleLogin(String identifier, String password, String loginType) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(identifier, password)
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

            validateRole(loginType, userPrincipal);

            String jwt = tokenProvider.generateToken(authentication);
            return createAuthResponse(jwt, userPrincipal);

        } catch (InvalidRoleException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid credentials"));
        }
    }

    
    @PostMapping("/register/hr")
    public ResponseEntity<?> registerHr(@Valid @RequestBody RegisterRequest registerRequest) {
        User user = userService.registerUser(registerRequest);
        String jwt = tokenProvider.generateTokenForUser(user);
        return createAuthResponse(jwt, UserPrincipal.create(user));
    }

    
    @PostMapping(value = "/register/employee", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerEmployee(
        @RequestPart("employeeId") String employeeId,
        @RequestPart("companyName") String companyName,
        @RequestPart("fullName") String fullName,
        @RequestPart("email") String email,
        @RequestPart("password") String password,
        @RequestPart(value = "photo", required = false) MultipartFile photo
    ) {
        EmployeeRegisterRequest request = new EmployeeRegisterRequest();
        request.setEmployeeId(employeeId);
        request.setCompanyName(companyName);
        request.setFullName(fullName);
        request.setEmail(email);
        request.setPassword(password);
        request.setPhoto(photo);

        User user = userService.registerEmployee(request);
        String jwt = tokenProvider.generateTokenForUser(user);
        return createAuthResponse(jwt, UserPrincipal.create(user));
    }

    
    private void validateRole(String loginType, UserPrincipal userPrincipal) throws InvalidRoleException {
        Set<String> roles = userPrincipal.getAuthorities().stream()
            .map(item -> item.getAuthority())
            .collect(Collectors.toSet());

        if ("hr".equalsIgnoreCase(loginType) && !roles.contains("ROLE_HR")) {
            throw new InvalidRoleException("User is not authorized as HR");
        }

        if ("employee".equalsIgnoreCase(loginType) && !roles.contains("ROLE_EMPLOYEE")) {
            throw new InvalidRoleException("User is not authorized as Employee");
        }
    }


    private ResponseEntity<Map<String, Object>> createAuthResponse(String jwt, UserPrincipal userPrincipal) {
        Set<String> roles = userPrincipal.getAuthorities().stream()
            .map(item -> item.getAuthority())
            .collect(Collectors.toSet());

        Map<String, Object> response = new HashMap<>();
        response.put("accessToken", jwt);
        response.put("id", userPrincipal.getId());
        response.put("username", userPrincipal.getUsername());
        response.put("email", userPrincipal.getEmail());
        response.put("roles", roles);
        response.put("fullName", userPrincipal.getFullName());

        return ResponseEntity.ok(response);
    }
  
    
@PostMapping("/forgot-password")
public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> request) {
    String email = request.get("email");
    
    boolean success = userService.handleForgotPassword(email);

    if (success) {
        return ResponseEntity.ok(Map.of("message", "Password reset link sent to " + email));
    } else {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                             .body(Map.of("error", "Email not found"));
    }
}


}
