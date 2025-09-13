package com.example.workhub.dto;

import java.time.LocalDate;

public record AnnouncementDto(
    Long id,
    String title,
    String content,
    String postedBy,
    LocalDate postedDate,
    boolean isPinned
) {}