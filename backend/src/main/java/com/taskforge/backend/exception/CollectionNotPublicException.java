package com.taskforge.backend.exception;

public class CollectionNotPublicException extends RuntimeException {
    public CollectionNotPublicException(String message) {
        super(message);
    }
}
