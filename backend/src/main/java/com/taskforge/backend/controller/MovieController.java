package com.taskforge.backend.controller;

import com.taskforge.backend.config.CustomPrincipal;
import com.taskforge.backend.dto.*;
import com.taskforge.backend.service.MovieServiceImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

    @PatchMapping("/{id}")
    public ResponseEntity<MovieResponseDto> updateMovieById(@PathVariable("id") String movieId,@RequestBody MovieAddingRequestDto movieRequest) {
        MovieResponseDto updatedMovie = movieService.updateMovieById(movieId,movieRequest);
        return ResponseEntity.status(HttpStatus.OK).body(updatedMovie);
    }

    @PostMapping("/{movieId}/interested")
    public ResponseEntity<InterestedStatusDto> markInterested(@PathVariable String movieId, @AuthenticationPrincipal CustomPrincipal principal) {
       InterestedStatusDto updatedInterest = movieService.markInterested(movieId, principal.getId());
       return ResponseEntity.status(HttpStatus.OK).body(updatedInterest);
    }

    @GetMapping("/{movieId}/interested-status")
    public ResponseEntity<InterestedStatusDto> getInterestedStatus(@PathVariable String movieId, @AuthenticationPrincipal CustomPrincipal principal) {
        InterestedStatusDto fetchInterest = movieService.getInterestedStatus(movieId, principal.getId());
        return ResponseEntity.status(HttpStatus.OK).body(fetchInterest);
    }

    @DeleteMapping("/{movieId}/interested")
    public ResponseEntity<InterestedStatusDto> removeInterested(@PathVariable String movieId, @AuthenticationPrincipal CustomPrincipal principal) {
        InterestedStatusDto removedInterest = movieService.removeInterested(movieId, principal.getId());
        return ResponseEntity.status(HttpStatus.OK).body(removedInterest);
    }

    @PostMapping("/{movieId}/opinion")
    public ResponseEntity<MovieOpinionResponseDto> submitOpinion(@PathVariable String movieId, @RequestBody MovieOpinionRequestDto request, @AuthenticationPrincipal CustomPrincipal principal) {
        MovieOpinionResponseDto updatedOpinion = movieService.submitOpinion(movieId, principal.getId(),request.getOpinionType());
        return ResponseEntity.status(HttpStatus.OK).body(updatedOpinion);
    }

    @GetMapping("/{movieId}/opinion")
    public ResponseEntity<RetrieveMovieOpinionDto> getUserOpinion(@PathVariable String movieId, @AuthenticationPrincipal CustomPrincipal principal) {
        RetrieveMovieOpinionDto retrievedResponse = movieService.getUserOpinion(movieId, principal.getId());
        return ResponseEntity.status(HttpStatus.OK).body(retrievedResponse);
    }

    @DeleteMapping("/{movieId}/opinion")
    public ResponseEntity<Void> deleteOpinion(@PathVariable String movieId, @AuthenticationPrincipal CustomPrincipal principal) {
        movieService.deleteOpinion(movieId, principal.getId());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping("/{movieId}/opinion-summary")
    public ResponseEntity<MovieOpinionSummaryDto> getOpinionSummary(@PathVariable String movieId) {
        MovieOpinionSummaryDto opinionSummary = movieService.getOpinionSummary(movieId);
        return ResponseEntity.status(HttpStatus.OK).body(opinionSummary);
    }

}
