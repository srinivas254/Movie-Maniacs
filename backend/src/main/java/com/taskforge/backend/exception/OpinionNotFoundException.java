package com.taskforge.backend.exception;

public class OpinionNotFoundException extends RuntimeException {
    public OpinionNotFoundException(String message){
        super(message);
    }
}
