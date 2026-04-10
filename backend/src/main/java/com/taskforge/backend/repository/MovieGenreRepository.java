package com.taskforge.backend.repository;

import com.taskforge.backend.entity.MovieGenre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface MovieGenreRepository extends JpaRepository<MovieGenre, Long> {

}

