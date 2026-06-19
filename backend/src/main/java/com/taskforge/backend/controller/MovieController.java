package com.taskforge.backend.controller;

import com.taskforge.backend.config.CustomPrincipal;
import com.taskforge.backend.dto.*;
import com.taskforge.backend.service.MovieServiceImpl;
import jakarta.annotation.security.PermitAll;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/movies")
public class MovieController {

    private final MovieServiceImpl movieService;

    @Autowired
    public MovieController(MovieServiceImpl movieService) {
        this.movieService = movieService;
    }

    @PreAuthorize("hasRole('ADMIN')")
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

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<Page<MovieResponseDto>> getAllMovies(Pageable pageable){
        Page<MovieResponseDto> movies = movieService.findAllMovies(pageable);
        return ResponseEntity.status(HttpStatus.OK).body(movies);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<MsgResponseDto> deleteMovieById(@PathVariable("id") String movieId) {
        movieService.deleteMovieById(movieId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}")
    public ResponseEntity<MovieResponseDto> updateMovieById(@PathVariable("id") String movieId,@Valid @RequestBody MovieUpdateRequestDto movieRequest) {
        MovieResponseDto updatedMovie = movieService.updateMovieById(movieId,movieRequest);
        return ResponseEntity.status(HttpStatus.OK).body(updatedMovie);
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/{movieId}/interested")
    public ResponseEntity<InterestedStatusDto> markInterested(@PathVariable String movieId, @AuthenticationPrincipal CustomPrincipal principal) {
       InterestedStatusDto updatedInterest = movieService.markInterested(movieId, principal.getId());
       return ResponseEntity.status(HttpStatus.OK).body(updatedInterest);
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/{movieId}/interested-status")
    public ResponseEntity<InterestedStatusDto> getInterestedStatus(@PathVariable String movieId, @AuthenticationPrincipal CustomPrincipal principal) {
        InterestedStatusDto fetchInterest = movieService.getInterestedStatus(movieId, principal.getId());
        return ResponseEntity.status(HttpStatus.OK).body(fetchInterest);
    }

    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/{movieId}/interested")
    public ResponseEntity<InterestedStatusDto> removeInterested(@PathVariable String movieId, @AuthenticationPrincipal CustomPrincipal principal) {
        InterestedStatusDto removedInterest = movieService.removeInterested(movieId, principal.getId());
        return ResponseEntity.status(HttpStatus.OK).body(removedInterest);
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/{movieId}/opinion")
    public ResponseEntity<MovieOpinionResponseDto> submitOpinion(@PathVariable String movieId,@Valid @RequestBody MovieOpinionRequestDto request, @AuthenticationPrincipal CustomPrincipal principal) {
        MovieOpinionResponseDto updatedOpinion = movieService.submitOpinion(movieId, principal.getId(),request.getOpinionType());
        return ResponseEntity.status(HttpStatus.OK).body(updatedOpinion);
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/{movieId}/opinion")
    public ResponseEntity<RetrieveMovieOpinionDto> getUserOpinion(@PathVariable String movieId, @AuthenticationPrincipal CustomPrincipal principal) {
        RetrieveMovieOpinionDto retrievedResponse = movieService.getUserOpinion(movieId, principal.getId());
        return ResponseEntity.status(HttpStatus.OK).body(retrievedResponse);
    }

    @PreAuthorize("hasRole('USER')")
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

    @GetMapping("/search")
    public List<MovieCardResponseDto> searchMovies(@RequestParam String q) {
        return movieService.searchMovies(q);
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/collections/add")
    public ResponseEntity<MsgResponseDto> createCollection(@RequestBody CreateCollectionRequestDto request, @AuthenticationPrincipal CustomPrincipal principal) {
        MsgResponseDto createdCollection = movieService.createCollection(request, principal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCollection);
    }

    @PreAuthorize("hasRole('USER')")
    @PutMapping("/collections/my-collections/{collectionName}")
    public ResponseEntity<MsgResponseDto> updateCollection(@PathVariable String collectionName, @RequestBody EditCollectionRequestDto request, @AuthenticationPrincipal CustomPrincipal principal) {
        MsgResponseDto response = movieService.updateCollection(collectionName, request, principal.getId());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/collections/my-collections")
    public ResponseEntity<List<CollectionCardDto>> getMyCollections(@AuthenticationPrincipal CustomPrincipal principal) {
        List<CollectionCardDto> myCollections = movieService.getMyCollections(principal.getId());
        return ResponseEntity.status(HttpStatus.OK).body(myCollections);
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/collections/my-collections/{collectionName}")
    public ResponseEntity<CollectionDetailsResponseDto> getCollectionDetails(@PathVariable String collectionName, @AuthenticationPrincipal CustomPrincipal principal) {
        CollectionDetailsResponseDto response = movieService.getCollectionDetails(collectionName, principal.getId());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/collections/my-collections/{collectionName}/movies/{movieId}")
    public ResponseEntity<MsgResponseDto> addMovieToCollection(@PathVariable String collectionName, @PathVariable String movieId, @AuthenticationPrincipal CustomPrincipal principal) {
        MsgResponseDto response = movieService.addMovieToCollection(collectionName, movieId, principal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/collections/my-collections/{collectionName}/movies/{movieId}")
    public ResponseEntity<Void> removeMovieFromCollection(@PathVariable String collectionName, @PathVariable String movieId, @AuthenticationPrincipal CustomPrincipal principal) {
        movieService.removeMovieFromCollection(collectionName, movieId, principal.getId());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PreAuthorize("hasRole('USER')")
    @PutMapping("/collections/my-collections/{collectionName}/movies")
    public ResponseEntity<Void> updateCollectionMovies(@PathVariable String collectionName, @RequestBody List<String> movieIds, @AuthenticationPrincipal CustomPrincipal principal) {
        movieService.updateCollectionMovies(collectionName, movieIds, principal.getId());
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/collections/my-collections/{collectionName}")
    public ResponseEntity<Void> deleteCollection(@PathVariable String collectionName, @AuthenticationPrincipal CustomPrincipal principal) {
        movieService.deleteCollection(collectionName, principal.getId());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/collections/my-collections/movie/{movieId}")
    public ResponseEntity<List<CollectionSummaryDto>> getCollectionsContainingMovie(@PathVariable String movieId, @AuthenticationPrincipal CustomPrincipal principal) {
        List<CollectionSummaryDto> response = movieService.getCollectionsContainingMovie(movieId, principal.getId());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/explore/editors-picks")
    public ResponseEntity<List<MovieCardResponseDto>> getEditorsPicks(@AuthenticationPrincipal CustomPrincipal principal){
        List<MovieCardResponseDto> response = movieService.getEditorsPicks(principal.getId());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/explore/netflix-picks")
    public ResponseEntity<List<MovieCardResponseDto>> getNetflixPicks(@AuthenticationPrincipal CustomPrincipal principal){
        List<MovieCardResponseDto> response = movieService.getNetflixPicks(principal.getId());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/explore/prime-picks")
    public ResponseEntity<List<MovieCardResponseDto>> getPrimePicks(@AuthenticationPrincipal CustomPrincipal principal){
        List<MovieCardResponseDto> response = movieService.getPrimePicks(principal.getId());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/explore/jio-picks")
    public ResponseEntity<List<MovieCardResponseDto>> getJioPicks(@AuthenticationPrincipal CustomPrincipal principal){
        List<MovieCardResponseDto> response = movieService.getJioPicks(principal.getId());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/explore/apple-picks")
    public ResponseEntity<List<MovieCardResponseDto>> getApplePicks(@AuthenticationPrincipal CustomPrincipal principal){
        List<MovieCardResponseDto> response = movieService.getApplePicks(principal.getId());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/explore/top-interested")
    public ResponseEntity<List<TopInterestedMovieResponseDto>> getTopInterestedMovies(@AuthenticationPrincipal CustomPrincipal principal) {
        List<TopInterestedMovieResponseDto> response = movieService.getTopInterestedMovies(principal.getId());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

}
