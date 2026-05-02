package com.taskforge.backend.repository;

import com.taskforge.backend.dto.MovieOpinionSummaryDto;
import com.taskforge.backend.entity.Movie;
import com.taskforge.backend.entity.MovieOpinion;
import com.taskforge.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface MovieOpinionRepository extends JpaRepository<MovieOpinion, Long> {
    Optional<MovieOpinion> findByUserAndMovie(
            User user,
            Movie movie
    );


    @Query("""
SELECT new com.taskforge.backend.dto.MovieOpinionSummaryDto(
    COUNT(mo),
      COALESCE(SUM(CASE WHEN mo.opinionType = com.taskforge.backend.entity.OpinionType.SKIP THEN 1 ELSE 0 END), 0),
      COALESCE(SUM(CASE WHEN mo.opinionType = com.taskforge.backend.entity.OpinionType.TIME_PASS THEN 1 ELSE 0 END), 0),
      COALESCE(SUM(CASE WHEN mo.opinionType = com.taskforge.backend.entity.OpinionType.GO_FOR_IT THEN 1 ELSE 0 END), 0),
      COALESCE(SUM(CASE WHEN mo.opinionType = com.taskforge.backend.entity.OpinionType.PERFECTION THEN 1 ELSE 0 END), 0),
      0.0, 0.0, 0.0, 0.0
)
FROM MovieOpinion mo
WHERE mo.movie.id = :movieId
""")
    MovieOpinionSummaryDto getMovieOpinionSummary(@Param("movieId") String movieId);
}

