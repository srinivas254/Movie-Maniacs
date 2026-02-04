package com.taskforge.backend.service;

import com.taskforge.backend.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    UserResponseDto findUserById(String id);
    Page<UserResponseDto> findAllUsers(Pageable pageable);
    void deleteUserById(String id,String password);
    MsgResponseDto updateProfileById(String id, ProfileUpdateRequestDto profileUpdateRequestDto);
    MsgResponseDto setPassword(String id,String newPassword);
    MsgResponseDto resetPassword(String id,ResetPasswordRequestDto request);
}
