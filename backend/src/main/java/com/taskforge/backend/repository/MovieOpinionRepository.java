package com.taskforge.backend.repository;

import com.taskforge.backend.entity.Movie;
import com.taskforge.backend.entity.MovieOpinion;
import com.taskforge.backend.entity.OpinionType;
import com.taskforge.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MovieOpinionRepository extends JpaRepository<MovieOpinion, Long> {
    Optional<MovieOpinion> findByMovieAndUser(Movie movie, User user);

    long countByMovieAndOpinionType(Movie movie, OpinionType opinionType);
}

