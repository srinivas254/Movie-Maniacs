package com.taskforge.backend.controller;

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
import org.springframework.web.bind.annotation.*;


@RestController
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService){
        this.userService = userService;
    }

    @PreAuthorize("(hasRole('USER') && #id == authentication.principal.id) || (hasRole('ADMIN'))")
    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable String id){
        UserResponseDto savedUser = userService.findUserById(id);
        return ResponseEntity.status(HttpStatus.OK).body(savedUser);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<Page<UserResponseDto>> getAllUsers(Pageable pageable){
        Page<UserResponseDto> users = userService.findAllUsers(pageable);
        return ResponseEntity.status(HttpStatus.OK).body(users);
    }

    @PreAuthorize("(hasRole('USER') && #id == authentication.principal.id) || (hasRole('ADMIN'))")
    @DeleteMapping("/users/{id}")
    public ResponseEntity<User> deleteUserById(@PathVariable String id){
        userService.deleteUserById(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PreAuthorize("hasRole('USER') && #id == authentication.principal.id")
    @PutMapping("/users/{id}")
    public ResponseEntity<ProfileUpdateResponseDto> updateProfileById(@PathVariable String id,@Valid @RequestBody ProfileUpdateRequestDto profileUpdateRequestDto){
        ProfileUpdateResponseDto updatedUser = userService.updateProfileById(id,profileUpdateRequestDto);
        return ResponseEntity.status(HttpStatus.OK).body(updatedUser);
    }

}
