package com.example.workhub.dto;

import java.time.LocalDate;

public record EventDto(
    Long id,
    String title,
    String description,
    LocalDate eventDate,
    String organizer
) {}