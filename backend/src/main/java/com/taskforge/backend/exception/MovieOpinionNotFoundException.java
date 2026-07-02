package com.taskforge.backend.exception;

public class MovieOpinionNotFoundException extends RuntimeException {
    public MovieOpinionNotFoundException(String message) {
        super(message);
    }
}
