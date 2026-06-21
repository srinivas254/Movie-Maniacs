package com.taskforge.backend.service;

import com.taskforge.backend.dto.*;

public interface AuthService {
    void saveUser(UserRegistrationRequestDto user);
    void loginAUser(OtpGenerationRequestDto userLoginRequestDto);
    LoginResponseDto verifyAOtp(OtpVerificationRequestDto otpVerificationRequestDto);
    String redirectToGoogle(String state);
    LoginResponseDto loginWithGoogle(String code);
    void registerWithGoogle(String code);
    boolean checkUserName(String userName);
    boolean checkEmail(String email);
    void forgotPassword(String email);
    void resetPassword(String rawToken,String oldPassword,String confirmPassword);
}
