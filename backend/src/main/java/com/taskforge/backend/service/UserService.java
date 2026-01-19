package com.taskforge.backend.service;

import com.taskforge.backend.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    UserResponseDto findUserById(String id);
    Page<UserResponseDto> findAllUsers(Pageable pageable);
    void deleteUserById(String id);
    ProfileUpdateResponseDto updateProfileById(String id, ProfileUpdateRequestDto profileUpdateRequestDto);
}
