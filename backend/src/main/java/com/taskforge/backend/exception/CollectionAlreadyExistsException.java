package com.taskforge.backend.exception;

public class CollectionAlreadyExistsException extends RuntimeException {
    public CollectionAlreadyExistsException (String message) {
        super(message);
    }
}
