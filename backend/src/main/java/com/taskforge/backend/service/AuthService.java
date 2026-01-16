package com.taskforge.backend.service;

import com.taskforge.backend.dto.*;

public interface AuthService {
    UserRegistrationResponseDto saveUser(UserRegistrationRequestDto user);
    OtpGenerationResponseDto loginAUser(OtpGenerationRequestDto userLoginRequestDto);
    LoginResponseDto verifyAOtp(OtpVerificationRequestDto otpVerificationRequestDto);
    String redirectToGoogle();
    LoginResponseDto loginWithGoogle(String code);
}
