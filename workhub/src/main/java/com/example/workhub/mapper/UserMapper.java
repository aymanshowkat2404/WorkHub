package com.example.workhub.mapper;

import com.example.workhub.dto.UserDto;
import com.example.workhub.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDto toDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setCompanyName(user.getCompanyName());
        dto.setEmployeeId(user.getEmployeeId());
        dto.setPhotoUrl(user.getPhotoUrl());
        return dto;
    }
}
