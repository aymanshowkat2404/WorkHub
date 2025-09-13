package com.example.workhub.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@Getter
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class CustomException extends RuntimeException {
    public CustomException(String message) {
        super(message);
    }
}
