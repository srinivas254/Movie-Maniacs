package com.taskforge.backend.service;

import com.taskforge.backend.dto.MovieAddingRequestDto;
import com.taskforge.backend.dto.MovieResponseDto;
import com.taskforge.backend.dto.MsgResponseDto;
import com.taskforge.backend.entity.Movie;
import com.taskforge.backend.exception.MovieNotFoundException;
import com.taskforge.backend.repository.MovieRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class MovieServiceImpl implements MovieService {
    private final MovieRepository movieRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public MovieServiceImpl(MovieRepository movieRepository,ModelMapper modelMapper){
        this.movieRepository = movieRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public MovieResponseDto saveMovie(MovieAddingRequestDto movie) {
        String slugName = movie.getName()
                .toLowerCase()
                .replaceAll("\\s+", "-");
        String generatedUrl = slugName + "-" + movie.getYear();
        Movie newMovie = new Movie();
        modelMapper.map(movie,newMovie);
        newMovie.setSlugUrl(generatedUrl);
        movieRepository.save(newMovie);
        return modelMapper.map(newMovie,MovieResponseDto.class);
    }

    @Override
    public MovieResponseDto getMovieBySlug(String movieUrl){
        Movie movie = movieRepository.findBySlugUrl(movieUrl)
                 .orElseThrow(() -> new MovieNotFoundException("Movie not found with slug: " + movieUrl));
        return modelMapper.map(movie,MovieResponseDto.class);
    }

    @Override
    public Page<MovieResponseDto> findAllMovies(Pageable pageable){
        Page<Movie> moviePage = movieRepository.findAll(pageable);
        return moviePage.map(movie -> modelMapper.map(movie, MovieResponseDto.class));
    }

    @Override
    public void deleteMovieById(String id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new MovieNotFoundException("Movie not found with id: " + id));
        movieRepository.delete(movie);
    }

    @Override
    public MovieResponseDto updateMovieById(String id,MovieAddingRequestDto movieRequest) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new MovieNotFoundException("Movie not found with id: " + id));

        boolean nameChanged = movieRequest.getName() != null;
        boolean yearChanged = movieRequest.getYear() != null;

        if(movieRequest.getName() != null){
            movie.setName(movieRequest.getName());
        }

        if(movieRequest.getYear() != null){
            movie.setYear(movieRequest.getYear());
        }

        if(movieRequest.getDuration() != null){
            movie.setDuration(movieRequest.getDuration());
        }

        if(movieRequest.getDirectedBy() != null){
            movie.setDirectedBy(movieRequest.getDirectedBy());
        }

        if(movieRequest.getCountry() != null){
            movie.setCountry(movieRequest.getCountry());
        }

        if(movieRequest.getLanguage() != null){
            movie.setLanguage(movieRequest.getLanguage());
        }

        if(movieRequest.getAgeRating() != null){
            movie.setAgeRating(movieRequest.getAgeRating());
        }

        if(movieRequest.getPosterSmallUrl() != null){
            movie.setPosterSmallUrl(movieRequest.getPosterSmallUrl());
        }

        if(movieRequest.getPosterWideUrl() != null){
            movie.setPosterWideUrl(movieRequest.getPosterWideUrl());
        }

        if(movieRequest.getOverview() != null){
            movie.setOverview(movieRequest.getOverview());
        }

        if(movieRequest.getWatchLink() != null){
            movie.setWatchLink(movieRequest.getWatchLink());
        }

        if (nameChanged || yearChanged) {
            String slugName = movie.getName()
                    .toLowerCase()
                    .replaceAll("\\s+", "-");
            String generatedUrl = slugName + "-" + movie.getYear();
            movie.setSlugUrl(generatedUrl);
        }

        movieRepository.save(movie);

        return modelMapper.map(movie, MovieResponseDto.class);
    }

}
