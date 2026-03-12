package com.taskforge.backend.repository;

import com.taskforge.backend.entity.CastCrew;
import com.taskforge.backend.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface CastCrewRepository extends JpaRepository<CastCrew, Long> {

}

