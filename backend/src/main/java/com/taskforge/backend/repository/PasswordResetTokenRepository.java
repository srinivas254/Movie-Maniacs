package com.taskforge.backend.repository;

import com.taskforge.backend.entity.PasswordResetToken;
import com.taskforge.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends
        JpaRepository<PasswordResetToken,Long> {
    // delete the token if it is used, or it is expired
    void deleteByUsedTrueOrExpiresAtBefore(LocalDateTime now);

    // find the latest token created for a user
    Optional<PasswordResetToken>
    findTopByUserAndUsedFalseAndExpiresAtAfterOrderByExpiresAtDesc(
            User user, LocalDateTime now
    );

    Optional<PasswordResetToken> findByUsedFalseAndExpiresAtAfter(LocalDateTime now);

}
