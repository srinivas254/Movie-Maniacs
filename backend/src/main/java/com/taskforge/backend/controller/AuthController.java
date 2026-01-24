package com.taskforge.backend.controller;

import com.taskforge.backend.dto.*;
import com.taskforge.backend.service.AuthService;
import jakarta.annotation.security.PermitAll;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService){
        this.authService = authService;
    }

    @PermitAll
    @PostMapping("/register")
    public ResponseEntity<UserRegistrationResponseDto> registerUser(@Valid @RequestBody UserRegistrationRequestDto user){
        UserRegistrationResponseDto savedUser = authService.saveUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    @PermitAll
    @PostMapping("/jwt/login")
    public ResponseEntity<OtpGenerationResponseDto> loginUser(@Valid @RequestBody OtpGenerationRequestDto otpGenerationRequestDto){
        OtpGenerationResponseDto loginUser = authService.loginAUser(otpGenerationRequestDto);
        return ResponseEntity.status(HttpStatus.OK).body(loginUser);
    }

    @PermitAll
    @PostMapping("/jwt/verify-otp")
    public ResponseEntity<LoginResponseDto> verifyOtp(@Valid @RequestBody OtpVerificationRequestDto otpVerificationRequestDto){
        LoginResponseDto otpResponse = authService.verifyAOtp(otpVerificationRequestDto);
        return ResponseEntity.status(HttpStatus.OK).body(otpResponse);
    }

    @PermitAll
    @GetMapping("/google")
    public void redirectToGoogle(HttpServletResponse res) throws IOException {
        String url = authService.redirectToGoogle();
        res.sendRedirect(url);
    }

    @PermitAll
    @GetMapping("/google/callback")
    public ResponseEntity<LoginResponseDto> callbackWithGoogle(@RequestParam("code") String code){
        LoginResponseDto googleUser = authService.loginWithGoogle(code);
        return ResponseEntity.status(HttpStatus.OK).body(googleUser);
    }

    @PermitAll
    @GetMapping("/check-username")
    public ResponseEntity<Map<String,Boolean>> checkUserName(@RequestParam String userName){
        boolean exists = authService.checkUserName(userName);
        Map<String,Boolean> response = new HashMap<>();
        response.put("available",!exists);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PermitAll
    @GetMapping("/check-email")
    public ResponseEntity<Map<String,Boolean>> checkEmail(@RequestParam String email){
        boolean exists = authService.checkEmail(email);
        Map<String,Boolean> response = new HashMap<>();
        response.put("available",!exists);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
