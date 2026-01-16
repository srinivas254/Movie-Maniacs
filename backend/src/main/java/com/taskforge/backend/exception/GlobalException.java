package com.taskforge.backend.exception;

import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalException {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidations(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errors.put(error.getField(), error.getDefaultMessage());
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrity(DataIntegrityViolationException di) {
        Map<String, String> errors = new HashMap<>();
        errors.put("error", "Email is already in use");
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errors);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> handleHttpMessageNotReadable(HttpMessageNotReadableException hm) {
        Map<String, String> errors = new HashMap<>();
        errors.put("error", "Malformed JSON request");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, String>> handleConstraintViolation(ConstraintViolationException cv) {
        Map<String, String> errors = new HashMap<>();
        cv.getConstraintViolations().forEach(cov -> {
            String field = cov.getPropertyPath().toString();
            String cleanField = field.contains(".")
                    ? field.substring(field.lastIndexOf(".") + 1)
                    : field;
            errors.put(cleanField, cov.getMessage());
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneric(Exception ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("error", "Internal Server error: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errors);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleUserNotFoundException(UserNotFoundException unf) {
        Map<String, String> errors = new HashMap<>();
        errors.put("error", unf.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errors);
    }

    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<Map<String, String>> handleInvalidPasswordException(InvalidPasswordException ip) {
        Map<String, String> errors = new HashMap<>();
        errors.put("error", ip.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errors);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgumentException(IllegalArgumentException iae) {
        Map<String, String> errors = new HashMap<>();
        errors.put("error", iae.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<Map<String, String>> handleJwtException(JwtException jwe){
        Map<String,String> errors = new HashMap<>();
        errors.put("error","Invalid or expired Google ID token: "+ jwe.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errors);
    }

    @ExceptionHandler(InvalidIdTokenException.class)
    public ResponseEntity<Map<String, String>> handleInvalidIdTokenException(InvalidIdTokenException iie){
        Map<String,String> errors = new HashMap<>();
        errors.put("error",iie.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleAccessDeniedException(AccessDeniedException ade) {
        Map<String, String> errors = new HashMap<>();
        errors.put("error", "Access is denied");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errors);
    }

    @ExceptionHandler(OtpNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleOtpNotFoundException(OtpNotFoundException onf) {
        Map<String, String> errors = new HashMap<>();
        errors.put("error", onf.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errors);
    }

    @ExceptionHandler(OtpExpiredException.class)
    public ResponseEntity<Map<String, String>> handleOtpExpiredException(OtpExpiredException oe) {
        Map<String, String> errors = new HashMap<>();
        errors.put("error", oe.getMessage());
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(errors);
    }

    @ExceptionHandler(InvalidOtpException.class)
    public ResponseEntity<Map<String, String>> handleInvalidOtpException(InvalidOtpException iot) {
        Map<String, String> errors = new HashMap<>();
        errors.put("error", iot.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException re) {
        Map<String, String> errors = new HashMap<>();
        errors.put("error", re.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errors);
    }

    @ExceptionHandler(InvalidResponseException.class)
    public ResponseEntity<Map<String, String>> handleInvalidResponseException(InvalidResponseException ire) {
        Map<String, String> errors = new HashMap<>();
        errors.put("error", ire.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    @ExceptionHandler(HttpClientErrorException.class)
    public ResponseEntity<Map<String, String>> handleHttpClientError(HttpClientErrorException hex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("error", hex.getMessage());
        errors.put("ResponseBody", hex.getResponseBodyAsString());
        return ResponseEntity.status(hex.getStatusCode()).body(errors);
    }

    @ExceptionHandler(ResourceAccessException.class)
    public ResponseEntity<Map<String, String>> handleResourceAccess(ResourceAccessException rex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("error", rex.getMessage());
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(errors);
    }

}
