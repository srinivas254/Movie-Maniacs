package com.taskforge.backend.service;

import com.taskforge.backend.dto.GenrePercentageDto;
import com.taskforge.backend.dto.MovieAddingRequestDto;
import com.taskforge.backend.dto.MovieResponseDto;
import com.taskforge.backend.entity.CastCrew;
import com.taskforge.backend.entity.Genre;
import com.taskforge.backend.entity.Movie;
import com.taskforge.backend.entity.MovieGenre;
import com.taskforge.backend.exception.MovieNotFoundException;
import com.taskforge.backend.repository.CastCrewRepository;
import com.taskforge.backend.repository.GenreRepository;
import com.taskforge.backend.repository.MovieGenreRepository;
import com.taskforge.backend.repository.MovieRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieServiceImpl implements MovieService {
    private final MovieRepository movieRepository;
    private final ModelMapper modelMapper;
    private final GenreRepository genreRepository;
    private final MovieGenreRepository movieGenreRepository;
    private final CastCrewRepository castCrewRepository;

    @Autowired
    public MovieServiceImpl(MovieRepository movieRepository,ModelMapper modelMapper, GenreRepository genreRepository, MovieGenreRepository movieGenreRepository, CastCrewRepository castCrewRepository){
        this.movieRepository = movieRepository;
        this.modelMapper = modelMapper;
        this.genreRepository = genreRepository;
        this.movieGenreRepository = movieGenreRepository;
        this.castCrewRepository = castCrewRepository;
    }

    @Override
    public MovieResponseDto saveMovie(MovieAddingRequestDto movie) {
        int total = movie.getGenres().stream()
                .mapToInt(GenrePercentageDto::getPercentage)
                .sum();
        if (total != 100) {
            throw new IllegalArgumentException("Genre percentages must sum to 100, got: " + total);
        }

        String slugName = movie.getName()
                .toLowerCase()
                .replaceAll("\\s+", "-");
        String generatedUrl = slugName + "-" + movie.getYear();

        Movie newMovie = new Movie();
        modelMapper.map(movie,newMovie);
        newMovie.setSlugUrl(generatedUrl);
        movieRepository.save(newMovie);

        List<MovieGenre> movieGenres = movie.getGenres().stream()
                .map(g -> {
                    String normalizedName = g.getName().trim().toLowerCase();

                    Genre genre = genreRepository.findByName(normalizedName)
                            .orElseGet(() -> genreRepository.save(
                                    Genre.builder()
                                            .name(normalizedName)
                                            .build()
                            ));
                    return MovieGenre.builder()
                            .movie(newMovie)
                            .genre(genre)
                            .percentage(g.getPercentage())
                            .build();
                })
                .toList();

        movieGenreRepository.saveAll(movieGenres);

        if (movie.getCastCrew() != null) {
            List<CastCrew> castCrewEntities = movie.getCastCrew().stream()
                    .map(cc -> {
                        boolean hasRole = cc.getRole() != null;
                        boolean hasCharacterName = cc.getCharacterName() != null;

                        if (hasRole == hasCharacterName) {
                            throw new IllegalArgumentException(
                                    "Person '" + cc.getName() + "' must have either role (CREW) or characterName (CAST), not both or neither"
                            );
                        }

                        return CastCrew.builder()
                                .movie(newMovie)
                                .type(cc.getType())
                                .name(cc.getName())
                                .role(cc.getRole())
                                .characterName(cc.getCharacterName())
                                .build();
                    })
                    .toList();

            castCrewRepository.saveAll(castCrewEntities);
        }

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
