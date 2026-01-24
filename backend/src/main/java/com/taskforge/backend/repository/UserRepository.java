package com.taskforge.backend.repository;

import com.taskforge.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long>{
    Optional<User> findByEmail(String email);
    Optional<User> findById(String id);
    Optional<User> findByUserName(String userName);
    Optional<User> findByProviderId(String providerId);
    boolean existsByUserName(String userName);
    boolean existsByEmail(String email);
}
