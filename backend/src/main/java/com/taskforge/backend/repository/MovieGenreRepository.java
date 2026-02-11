package com.taskforge.backend.repository;

import com.taskforge.backend.entity.Movie;
import com.taskforge.backend.entity.MovieGenre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieGenreRepository extends JpaRepository<MovieGenre, Long> {
    List<MovieGenre> findByMovie(Movie movie);
}

