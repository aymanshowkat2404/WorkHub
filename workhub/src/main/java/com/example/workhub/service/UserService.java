package com.example.workhub.service;

import com.example.workhub.dto.EmployeeRegisterRequest;
import com.example.workhub.dto.RegisterRequest;
import com.example.workhub.exception.ResourceNotFoundException;
import com.example.workhub.model.ERole;
import com.example.workhub.model.Role;
import com.example.workhub.model.User;
import com.example.workhub.repository.RoleRepository;
import com.example.workhub.repository.UserRepository;
import com.example.workhub.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String usernameOrEmployeeId) throws UsernameNotFoundException {
        return userRepository.findByEmail(usernameOrEmployeeId)
            .or(() -> userRepository.findByEmployeeId(usernameOrEmployeeId))
            .map(UserPrincipal::create)
            .orElseThrow(() ->
                new UsernameNotFoundException("User not found with email or employee ID: " + usernameOrEmployeeId));
    }
    

    @Transactional
    public UserDetails loadUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        return UserPrincipal.create(user);
    }

    public User registerUser(RegisterRequest registerRequest) {

        // Email check only, as username field is no longer present
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }
    
        // Check if passwords match (optional but recommended)
        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match!");
        }
    
        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());

    
        Set<Role> roles = new HashSet<>();
        String role = registerRequest.getRole(); // assuming role is a single string like "hr"
    
        if (role == null || role.isBlank() || role.equalsIgnoreCase("employee")) {
            Role employeeRole = roleRepository.findByName(ERole.ROLE_EMPLOYEE)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(employeeRole);
        } else if (role.equalsIgnoreCase("hr")) {
            Role hrRole = roleRepository.findByName(ERole.ROLE_HR)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(hrRole);
        }
    
        user.setRoles(roles);
        return userRepository.save(user);
    }
    public User registerEmployee(EmployeeRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }
    
        if (userRepository.existsByEmployeeId(request.getEmployeeId())) {
            throw new RuntimeException("Employee ID is already in use!");
        }
    
        String fullName = request.getFullName().trim();
        String[] parts = fullName.split(" ", 2);
        String firstName = parts[0];
        String lastName = parts.length > 1 ? parts[1] : "NA";
    
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setCompanyName(request.getCompanyName());
        user.setEmployeeId(request.getEmployeeId());
    
        Set<Role> roles = new HashSet<>();
        Role employeeRole = roleRepository.findByName(ERole.ROLE_EMPLOYEE)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        roles.add(employeeRole);
        user.setRoles(roles);
    
        return userRepository.save(user);
    }
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }
    @Transactional
public boolean handleForgotPassword(String email) {
    return userRepository.findByEmail(email).isPresent();
}

    
}
