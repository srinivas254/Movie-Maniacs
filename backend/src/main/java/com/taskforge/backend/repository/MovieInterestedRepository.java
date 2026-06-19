package com.taskforge.backend.repository;

import com.taskforge.backend.entity.Movie;
import com.taskforge.backend.entity.MovieInterested;
import com.taskforge.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieInterestedRepository extends JpaRepository<MovieInterested, Long> {
    boolean existsByUserAndMovie(User user, Movie movie);

    void deleteByUserAndMovie(User user, Movie movie);

    @Query(value = """
    SELECT
        movie_id,
        COUNT(*) AS interested_count
    FROM movie_interested
    GROUP BY movie_id
    ORDER BY COUNT(*) DESC
    LIMIT 10
    """, nativeQuery = true)
    List<Object[]> findTopInterestedMovies();
}

