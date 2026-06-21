package com.taskforge.backend.service;

import com.taskforge.backend.dto.*;
import com.taskforge.backend.entity.OpinionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;


public interface MovieService {
    MovieResponseDto saveMovie(MovieAddingRequestDto movie);
    MovieResponseDto getMovieBySlug(String movieUrl);
    Page<MovieResponseDto> findAllMovies(Pageable pageable);
    void deleteMovieById(String id);
    MovieResponseDto updateMovieById(String id,MovieUpdateRequestDto movieRequest);
    InterestedStatusDto markInterested(String movieId, String userId);
    InterestedStatusDto getInterestedStatus(String movieId, String userId);
    InterestedStatusDto removeInterested(String movieId,String userId);
    MovieOpinionResponseDto  submitOpinion(String movieId, String userId, MovieOpinionRequestDto request);
    RetrieveMovieOpinionDto getUserOpinion(String movieId, String userId);
    void deleteOpinion(String movieId, String userId);
    MovieOpinionSummaryDto getOpinionSummary(String movieId);
    List<MovieCardResponseDto> searchMovies(String query);
    void createCollection(CreateCollectionRequestDto request, String userId);
    List<CollectionCardDto> getMyCollections(String userId);
    CollectionDetailsResponseDto getCollectionDetails(String collectionName, String userId);
    MsgResponseDto addMovieToCollection(String collectionName, String movieId, String userId);
    MsgResponseDto updateCollection(String collectionName, EditCollectionRequestDto request, String userId);
    void updateCollectionMovies(String collectionName, List<String> movieIds, String userId);
    void deleteCollection(String collectionName, String userId);
    List<CollectionSummaryDto> getCollectionsContainingMovie(String movieId, String userId);
    void removeMovieFromCollection(String collectionName, String movieId, String userId);
    List<MovieCardResponseDto> getEditorsPicks(String userId);
    List<MovieCardResponseDto> getNetflixPicks(String userId);
    List<MovieCardResponseDto> getPrimePicks(String userId);
    List<MovieCardResponseDto> getJioPicks(String userId);
    List<MovieCardResponseDto> getApplePicks(String userId);
    List<TopInterestedMovieResponseDto> getTopInterestedMovies(String userId);
}
