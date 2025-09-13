package com.example.workhub.repository;

import com.example.workhub.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByEventDateGreaterThanEqualOrderByEventDateAsc(LocalDate date);
} 