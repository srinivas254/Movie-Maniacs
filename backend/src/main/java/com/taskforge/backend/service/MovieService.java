package com.taskforge.backend.service;

import com.taskforge.backend.dto.MovieAddingRequestDto;
import com.taskforge.backend.dto.MovieResponseDto;
import com.taskforge.backend.dto.MsgResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface MovieService {
    MovieResponseDto saveMovie(MovieAddingRequestDto movie);
    MovieResponseDto getMovieBySlug(String movieUrl);
    Page<MovieResponseDto> findAllMovies(Pageable pageable);
    void deleteMovieById(String id);
    MovieResponseDto updateMovieById(String id,MovieAddingRequestDto movieRequest);
}
