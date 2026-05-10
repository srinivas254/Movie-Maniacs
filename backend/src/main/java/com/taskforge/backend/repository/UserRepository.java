package com.taskforge.backend.repository;

import com.taskforge.backend.entity.Role;
import com.taskforge.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,String>{
    Optional<User> findByEmail(String email);
    Optional<User> findByUserName(String userName);
    Optional<User> findByProviderId(String providerId);
    boolean existsByUserName(String userName);
    boolean existsByEmail(String email);
    Optional<User> findByRole(Role role);
}
