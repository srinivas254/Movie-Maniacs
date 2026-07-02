package com.taskforge.backend.repository;

import com.taskforge.backend.entity.Genre;
import com.taskforge.backend.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<Movie,String> {
    Optional<Movie> findBySlugUrl(String slugUrl);
    List<Movie> findByNameStartingWithIgnoreCase(String name);
    List<Movie> findByYearBetween(Integer startYear, Integer endYear);
    List<Movie> findByLanguageIgnoreCase(String language);
    List<Movie> findByCountryIgnoreCase(String country);
    List<Movie> findByDurationBetween(Integer startDuration, Integer endDuration);

    @Query("""
        SELECT mg.movie
        FROM MovieGenre mg
        WHERE mg.genre = :genre
    """)
    List<Movie> findMoviesByGenre(@Param("genre") Genre genre);

    @Query(value = """
        SELECT DISTINCT m.*
        FROM movie m
        JOIN watch_link w ON m.id = w.movie_id
        WHERE LOWER(w.platform) = LOWER(:platform)
        """, nativeQuery = true)
    List<Movie> findMoviesByPlatform(@Param("platform") String platform);
}
