package com.taskforge.backend.service;

import com.taskforge.backend.config.JwtUtil;
import com.taskforge.backend.dto.AdminLoginRequestDto;
import com.taskforge.backend.dto.LoginResponseDto;
import com.taskforge.backend.entity.Role;
import com.taskforge.backend.entity.User;
import com.taskforge.backend.exception.InvalidPasswordException;
import com.taskforge.backend.exception.UserNotFoundException;
import com.taskforge.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;

@Service
public class AdminServiceImpl implements AdminService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Autowired
    public AdminServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder,JwtUtil jwtUtil){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public LoginResponseDto loginAdmin(AdminLoginRequestDto adminLoginRequestDto){

        User admin = userRepository
                .findByUserName(adminLoginRequestDto.getUserName())
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "Admin not found with username: "
                                        + adminLoginRequestDto.getUserName()
                        ));

        if(admin.getRole() != Role.ADMIN){
            throw new AccessDeniedException("You are not authorized to access admin panel");
        }

        boolean isPasswordCorrect =
                passwordEncoder.matches(
                        adminLoginRequestDto.getPassword(),
                        admin.getPassword()
                );

        if(!isPasswordCorrect){
            throw new InvalidPasswordException(
                    "Entered password is incorrect"
            );
        }

        String jwtToken =
                jwtUtil.generateToken(
                        admin.getId(),
                        admin.getRole()
                );

        return LoginResponseDto.builder()
                .message("Admin login successful")
                .token(jwtToken)
                .build();
    }

    @Override
    public void deleteAnyUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with id: " + userId
                        ));

        userRepository.delete(user);
    }
}
