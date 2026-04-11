package com.taskforge.backend.repository;

import com.taskforge.backend.entity.CastCrew;
import com.taskforge.backend.entity.WatchLink;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WatchLinkRepository extends JpaRepository<WatchLink, Long> {
    List<WatchLink> findByMovieId(String movieId);
    void deleteByMovieId(String movieId);
}
