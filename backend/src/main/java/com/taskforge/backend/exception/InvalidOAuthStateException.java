package com.taskforge.backend.exception;

public class InvalidOAuthStateException extends RuntimeException {
    public InvalidOAuthStateException(String message) {
        super(message);
    }
}
