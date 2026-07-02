package com.taskforge.backend.exception;

public class CollectionAlreadySavedException extends RuntimeException {
    public CollectionAlreadySavedException(String message) {
        super(message);
    }
}
