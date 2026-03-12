package com.taskforge.backend.service;

import com.taskforge.backend.dto.MovieAddingRequestDto;
import com.taskforge.backend.dto.MovieResponseDto;
import com.taskforge.backend.dto.MsgResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface MovieService {
    MsgResponseDto saveMovie(MovieAddingRequestDto movie);
    MovieResponseDto getMovieBySlug(String movieUrl);
    Page<MovieResponseDto> findAllMovies(Pageable pageable);
    void deleteMovieById(String id);
    MsgResponseDto updateMovieById(String id,MovieAddingRequestDto movieRequest);
}
