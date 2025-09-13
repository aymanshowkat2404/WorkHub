package com.example.workhub.dto;

import java.time.LocalDate;

public record NotificationDto(
    Long id,
    String title,
    String message,
    LocalDate createdAt,
    boolean isRead
) {}