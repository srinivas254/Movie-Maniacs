package com.taskforge.backend.service;

import com.taskforge.backend.dto.*;
import com.taskforge.backend.entity.OpinionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface MovieService {
    MovieResponseDto saveMovie(MovieAddingRequestDto movie);
    MovieResponseDto getMovieBySlug(String movieUrl);
    Page<MovieResponseDto> findAllMovies(Pageable pageable);
    void deleteMovieById(String id);
    MovieResponseDto updateMovieById(String id,MovieAddingRequestDto movieRequest);
    InterestedStatusDto markInterested(String movieId, String userId);
    InterestedStatusDto getInterestedStatus(String movieId, String userId);
    InterestedStatusDto removeInterested(String movieId,String userId);
    MovieOpinionResponseDto  submitOpinion(String movieId, String userId, OpinionType opinionType);
    RetrieveMovieOpinionDto getUserOpinion(String movieId, String userId);
    void deleteOpinion(String movieId, String userId);
    MovieOpinionSummaryDto getOpinionSummary(String movieId);
}
