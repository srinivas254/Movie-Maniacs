package com.taskforge.backend.repository;

import com.taskforge.backend.entity.Movie;
import com.taskforge.backend.entity.MovieInterested;
import com.taskforge.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieInterestedRepository extends JpaRepository<MovieInterested, Long> {
    boolean existsByMovieAndUser(Movie movie, User user);

    long countByMovie(Movie movie);

    void deleteByMovieAndUser(Movie movie, User user);
}

