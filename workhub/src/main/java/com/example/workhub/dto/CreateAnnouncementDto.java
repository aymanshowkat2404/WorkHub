package com.example.workhub.dto;

public record CreateAnnouncementDto(
    String title,
    String content,
    boolean isPinned
) {}