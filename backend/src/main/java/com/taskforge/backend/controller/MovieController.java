package com.taskforge.backend.controller;

import com.taskforge.backend.dto.MovieAddingRequestDto;
import com.taskforge.backend.dto.MovieResponseDto;
import com.taskforge.backend.dto.MsgResponseDto;
import com.taskforge.backend.dto.UserResponseDto;
import com.taskforge.backend.entity.Movie;
import com.taskforge.backend.service.MovieServiceImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/movies")
public class MovieController {

    private final MovieServiceImpl movieService;

    @Autowired
    public MovieController(MovieServiceImpl movieService) {
        this.movieService = movieService;
    }

    @PostMapping("/add")
    public ResponseEntity<MovieResponseDto> addMovie(@Valid @RequestBody MovieAddingRequestDto movie) {
        MovieResponseDto savedMovie = movieService.saveMovie(movie);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMovie);
    }

    @GetMapping("/{slug_url}")
    public ResponseEntity<MovieResponseDto> getMovieBySlug(@PathVariable("slug_url") String movieUrl) {
        MovieResponseDto movie = movieService.getMovieBySlug(movieUrl);
        return ResponseEntity.status(HttpStatus.OK).body(movie);
    }

    @GetMapping("/all")
    public ResponseEntity<Page<MovieResponseDto>> getAllMovies(Pageable pageable){
        Page<MovieResponseDto> movies = movieService.findAllMovies(pageable);
        return ResponseEntity.status(HttpStatus.OK).body(movies);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MsgResponseDto> deleteMovieById(@PathVariable("id") String movieId) {
        movieService.deleteMovieById(movieId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<MsgResponseDto> updateMovieById(@PathVariable("id") String movieId,@Valid @RequestBody MovieAddingRequestDto movieRequest) {
        MsgResponseDto updatedMovie = movieService.updateMovieById(movieId,movieRequest);
        return ResponseEntity.status(HttpStatus.OK).body(updatedMovie);
    }

}
