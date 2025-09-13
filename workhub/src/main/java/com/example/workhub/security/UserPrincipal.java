package com.example.workhub.security;

import com.example.workhub.model.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@AllArgsConstructor
public class UserPrincipal implements UserDetails {
    private Long id;
    private String username;
    private String email;
    private String fullName;


    @JsonIgnore
    private String password;

    private Collection<? extends GrantedAuthority> authorities;

    public static UserPrincipal create(User user) {
        List<GrantedAuthority> authorities = user.getRoles().stream()
            .map(role -> new SimpleGrantedAuthority(role.getName().name()))
            .collect(Collectors.toList());

            return new UserPrincipal(
                user.getId(),
                user.getFirstName(),
                user.getEmail(),
                user.getLastName(),     // ✅ Correct position
                user.getPassword(),
                authorities
            );
       
    }

    // ✅ Required methods from UserDetails
    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    // 🔴 Remove this unimplemented method and constructor if not used
    /*
    public Object getFullName() {
        throw new UnsupportedOperationException("Unimplemented method 'getFullName'");
    }
    */

    /*
    public UserPrincipal(User user) {
        // Remove this unless you're going to fill it correctly
    }
    */
}