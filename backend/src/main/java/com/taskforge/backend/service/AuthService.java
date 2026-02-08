package com.taskforge.backend.service;

import com.taskforge.backend.dto.*;

public interface AuthService {
    MsgResponseDto saveUser(UserRegistrationRequestDto user);
    MsgResponseDto loginAUser(OtpGenerationRequestDto userLoginRequestDto);
    LoginResponseDto verifyAOtp(OtpVerificationRequestDto otpVerificationRequestDto);
    String redirectToGoogle(String state);
    LoginResponseDto loginWithGoogle(String code);
    void registerWithGoogle(String code);
    boolean checkUserName(String userName);
    boolean checkEmail(String email);
    MsgResponseDto forgotPassword(String email);
    MsgResponseDto resetPassword(String rawToken,String oldPassword,String confirmPassword);
}
