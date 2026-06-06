package com.taskforge.backend.exception;

public class MovieExistsException extends RuntimeException{
    public MovieExistsException(String message){
        super(message);
    }
}
