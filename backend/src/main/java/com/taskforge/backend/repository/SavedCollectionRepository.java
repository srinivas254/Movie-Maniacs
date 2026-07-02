package com.taskforge.backend.repository;

import com.taskforge.backend.entity.SavedCollection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SavedCollectionRepository extends JpaRepository<SavedCollection, Long> {
    boolean existsByUserIdAndCollectionId(String userId, Long collectionId);
    Optional<SavedCollection> findByUserIdAndCollectionId(String userId, Long collectionId);
    List<SavedCollection> findByUserId(String userId);
}
