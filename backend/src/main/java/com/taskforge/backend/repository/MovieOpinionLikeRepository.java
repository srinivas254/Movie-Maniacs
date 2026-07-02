package com.taskforge.backend.repository;

import com.taskforge.backend.entity.MovieOpinion;
import com.taskforge.backend.entity.MovieOpinionLike;
import com.taskforge.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MovieOpinionLikeRepository
        extends JpaRepository<MovieOpinionLike, Long> {

    boolean existsByMovieOpinionAndUser(
            MovieOpinion movieOpinion,
            User user
    );

    Optional<MovieOpinionLike> findByMovieOpinionAndUser(
            MovieOpinion movieOpinion,
            User user
    );

    long countByMovieOpinion(MovieOpinion movieOpinion);
}
