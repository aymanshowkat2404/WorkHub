package com.example.workhub.controller;

import com.example.workhub.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class WebSocketController {
    private final EmployeeService employeeService;

    @MessageMapping("/request-update")
    @SendTo("/topic/updates")
    public Object requestUpdate() {
        return employeeService.getAllEmployees();
    }
}