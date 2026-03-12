package com.taskforge.backend.repository;

import com.taskforge.backend.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<Movie,String> {
    Optional<Movie> findBySlugUrl(String slugUrl);
}
