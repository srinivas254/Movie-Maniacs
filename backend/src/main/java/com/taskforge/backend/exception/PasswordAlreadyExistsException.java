package com.taskforge.backend.exception;

public class PasswordAlreadyExistsException extends RuntimeException {
    public PasswordAlreadyExistsException(String message) {
        super(message);
    }
}

