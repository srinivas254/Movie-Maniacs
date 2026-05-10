package com.taskforge.backend.config;

import com.taskforge.backend.entity.AuthProvider;
import com.taskforge.backend.entity.Role;
import com.taskforge.backend.entity.User;
import com.taskforge.backend.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class AdminInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.username}")
    private String adminUsername;

    @Value("${admin.password}")
    private String adminPassword;

    @PostConstruct
    public void initAdmin() {

        Optional<User> adminExists =
                userRepository.findByRole(Role.ADMIN);

        if(adminExists.isEmpty()) {

            User admin = new User();

            admin.setUserName(adminUsername);
            admin.setPassword(
                    passwordEncoder.encode(adminPassword)
            );

            admin.setRole(Role.ADMIN);
            admin.setProvider(AuthProvider.LOCAL);

            userRepository.save(admin);
        }
    }
}
