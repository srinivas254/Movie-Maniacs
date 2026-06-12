package com.taskforge.backend.repository;

import com.taskforge.backend.entity.Collection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CollectionRepository extends JpaRepository<Collection, Long> {
    List<Collection> findByUserId(String userId);
    Optional<Collection> findByNameAndUserId(String name, String userId);
    boolean existsByName(String name);
}
