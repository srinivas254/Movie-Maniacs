package com.taskforge.backend.exception;

public class InvalidIdTokenException extends RuntimeException{
    public InvalidIdTokenException(String message){
        super(message);
    }
}
