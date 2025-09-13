package com.example.workhub.dto;

import java.time.LocalDate;

public record CreateEventDto(
    String title,
    String description,
    LocalDate eventDate
) {}