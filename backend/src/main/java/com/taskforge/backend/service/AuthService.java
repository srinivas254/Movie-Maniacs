package com.taskforge.backend.service;

import com.taskforge.backend.dto.*;

public interface AuthService {
    UserRegistrationResponseDto saveUser(UserRegistrationRequestDto user);
    OtpGenerationResponseDto loginAUser(OtpGenerationRequestDto userLoginRequestDto);
    LoginResponseDto verifyAOtp(OtpVerificationRequestDto otpVerificationRequestDto);
    String redirectToGoogle(String state);
    LoginResponseDto loginWithGoogle(String code);
    UserRegistrationResponseDto registerWithGoogle(String code);
    boolean checkUserName(String userName);
    boolean checkEmail(String email);
}
