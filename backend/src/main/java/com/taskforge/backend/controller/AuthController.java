package com.taskforge.backend.controller;

import com.taskforge.backend.dto.*;
import com.taskforge.backend.exception.InvalidOAuthStateException;
import com.taskforge.backend.service.AuthService;
import jakarta.annotation.security.PermitAll;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
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
    public ResponseEntity<MsgResponseDto> registerUser(@Valid @RequestBody UserRegistrationRequestDto user){
        MsgResponseDto savedUser = authService.saveUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    @PermitAll
    @PostMapping("/jwt/login")
    public ResponseEntity<MsgResponseDto> loginUser(@Valid @RequestBody OtpGenerationRequestDto otpGenerationRequestDto){
        MsgResponseDto loginUser = authService.loginAUser(otpGenerationRequestDto);
        return ResponseEntity.status(HttpStatus.OK).body(loginUser);
    }

    @PermitAll
    @PostMapping("/jwt/verify-otp")
    public ResponseEntity<LoginResponseDto> verifyOtp(@Valid @RequestBody OtpVerificationRequestDto otpVerificationRequestDto){
        LoginResponseDto otpResponse = authService.verifyAOtp(otpVerificationRequestDto);
        return ResponseEntity.status(HttpStatus.OK).body(otpResponse);
    }

    @PermitAll
    @GetMapping("/google/login")
    public void redirectToGoogleLogin(HttpServletResponse res) throws IOException {
        String url = authService.redirectToGoogle("login");
        res.sendRedirect(url);
    }

    @PermitAll
    @GetMapping("/google/register")
    public void redirectToGoogleRegister(HttpServletResponse res) throws IOException {
        String url = authService.redirectToGoogle("register");
        res.sendRedirect(url);
    }

    @PermitAll
    @GetMapping("/google/callback")
    public void callbackWithGoogle(
            @RequestParam("code") String code,
            @RequestParam("state") String state,
            HttpServletResponse response
    ) throws IOException {

        try {

            if ("login".equals(state)) {
                LoginResponseDto result =
                        authService.loginWithGoogle(code);
                String encodedToken = URLEncoder.encode(
                        result.getToken(),
                        StandardCharsets.UTF_8
                );
                response.sendRedirect(
                        "http://localhost:5173/oauth-success?token=" + encodedToken
                );
                return;
            }

            if ("register".equals(state)) {
                authService.registerWithGoogle(code);
                response.sendRedirect(
                        "http://localhost:5173/login?registered=true"
                );
                return;
            }

            throw new InvalidOAuthStateException("Invalid OAuth state");

        }
        catch (Exception ex) {

            String errorMsg = URLEncoder.encode(
                    ex.getMessage(),
                    StandardCharsets.UTF_8
            );

            if ("register".equals(state)) {
                response.sendRedirect(
                        "http://localhost:5173/register?error=" + errorMsg
                );
            } else {
                response.sendRedirect(
                        "http://localhost:5173/login?error=" + errorMsg
                );
            }
        }
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

    @PermitAll
    @PostMapping("/forgot-password")
    public ResponseEntity<MsgResponseDto> forgotPassword(
            @RequestBody ForgotPasswordRequestDto forgotPasswordRequestDto
    ) {
        MsgResponseDto response = authService.forgotPassword(forgotPasswordRequestDto.getEmail());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<MsgResponseDto> resetPassword(
            @RequestBody ResetNewPasswordRequestDto resetNewPasswordRequestDto
    ) {
        MsgResponseDto response =
                authService.resetPassword(resetNewPasswordRequestDto.getRawToken(),
                        resetNewPasswordRequestDto.getNewPassword(),
                        resetNewPasswordRequestDto.getConfirmPassword());
        return ResponseEntity.ok(response);
    }
}
