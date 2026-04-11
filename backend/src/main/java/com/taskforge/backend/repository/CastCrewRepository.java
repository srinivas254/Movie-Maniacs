package com.taskforge.backend.repository;

import com.taskforge.backend.entity.CastCrew;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface CastCrewRepository extends JpaRepository<CastCrew, Long> {
    List<CastCrew> findByMovieId(String movieId);
    void deleteByMovieId(String movieId);
}

