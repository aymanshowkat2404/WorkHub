package com.example.workhub.dto;
public record HRDashboardStatsDto(
    int totalEmployees,
    int activeEmployees,
    int onLeaveToday,
    int resignedThisMonth,
    int upcomingBirthdays
) {}

