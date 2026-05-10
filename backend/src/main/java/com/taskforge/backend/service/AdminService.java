package com.taskforge.backend.service;

import com.taskforge.backend.dto.AdminLoginRequestDto;
import com.taskforge.backend.dto.LoginResponseDto;

public interface AdminService {
    LoginResponseDto loginAdmin(AdminLoginRequestDto adminLoginRequestDto);
    void deleteAnyUser(String userId);
}
