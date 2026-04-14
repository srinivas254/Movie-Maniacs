package com.taskforge.backend.exception;

public class InvalidGenrePercentageException extends RuntimeException {
    public InvalidGenrePercentageException(int total) {
        super("Genre percentages must sum to 100, got: " + total);
    }
}
