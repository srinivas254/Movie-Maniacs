package com.taskforge.backend.exception;

public class ExternalServiceException extends RuntimeException{
    public ExternalServiceException(String message){
        super(message);
    }
}
