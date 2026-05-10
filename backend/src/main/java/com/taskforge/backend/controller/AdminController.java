package com.taskforge.backend.controller;

import com.taskforge.backend.dto.AdminLoginRequestDto;
import com.taskforge.backend.dto.LoginResponseDto;
import com.taskforge.backend.service.AdminServiceImpl;
import jakarta.annotation.security.PermitAll;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private final AdminServiceImpl adminService;

    public AdminController(AdminServiceImpl adminService){
        this.adminService = adminService;
    }

    @PermitAll
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody AdminLoginRequestDto request){
        LoginResponseDto response = adminService.loginAdmin(request);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteAnyUser(@PathVariable String userId) {
        adminService.deleteAnyUser(userId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
