package com.taskforge.backend.service;

import com.taskforge.backend.entity.Movie;
import com.taskforge.backend.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MovieServiceImpl {
    private final MovieRepository movieRepository;

    @Autowired
    public MovieServiceImpl(MovieRepository movieRepository){
        this.movieRepository = movieRepository;
    }

    public Movie saveMovie(Movie movie) {
        String slugName = movie.getName()
                .toLowerCase()
                .replaceAll("\\s+", "-");
        String generatedId = slugName + "-" + movie.getYear();
        movie.setId(generatedId);

        return movieRepository.save(movie);
    }

}
