package com.taskforge.backend.controller;

import com.taskforge.backend.config.CustomPrincipal;
import com.taskforge.backend.dto.*;
import com.taskforge.backend.entity.User;
import com.taskforge.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService){
        this.userService = userService;
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getUserById(@AuthenticationPrincipal CustomPrincipal principal){
        UserResponseDto savedUser = userService.findUserById(principal.getId());
        return ResponseEntity.status(HttpStatus.OK).body(savedUser);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<Page<UserResponseDto>> getAllUsers(Pageable pageable){
        Page<UserResponseDto> users = userService.findAllUsers(pageable);
        return ResponseEntity.status(HttpStatus.OK).body(users);
    }

    @PreAuthorize("(hasRole('USER')")
    @DeleteMapping("/me")
    public ResponseEntity<User> deleteUserById(@AuthenticationPrincipal CustomPrincipal principal){
        userService.deleteUserById(principal.getId());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PreAuthorize("hasRole('USER')")
    @PutMapping("/me")
    public ResponseEntity<ProfileUpdateResponseDto> updateProfileById(@AuthenticationPrincipal CustomPrincipal principal,@Valid @RequestBody ProfileUpdateRequestDto profileUpdateRequestDto){
        ProfileUpdateResponseDto updatedUser = userService.updateProfileById(principal.getId(),profileUpdateRequestDto);
        return ResponseEntity.status(HttpStatus.OK).body(updatedUser);
    }

}
