package com.taskforge.backend.service;

import com.taskforge.backend.dto.*;
import com.taskforge.backend.entity.*;
import com.taskforge.backend.exception.MovieNotFoundException;
import com.taskforge.backend.repository.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class MovieServiceImpl implements MovieService {
    private final MovieRepository movieRepository;
    private final ModelMapper modelMapper;
    private final GenreRepository genreRepository;
    private final MovieGenreRepository movieGenreRepository;
    private final CastCrewRepository castCrewRepository;
    private final WatchLinkRepository watchLinkRepository;

    @Autowired
    public MovieServiceImpl(MovieRepository movieRepository,ModelMapper modelMapper, GenreRepository genreRepository, MovieGenreRepository movieGenreRepository, CastCrewRepository castCrewRepository, WatchLinkRepository watchLinkRepository){
        this.movieRepository = movieRepository;
        this.modelMapper = modelMapper;
        this.genreRepository = genreRepository;
        this.movieGenreRepository = movieGenreRepository;
        this.castCrewRepository = castCrewRepository;
        this.watchLinkRepository = watchLinkRepository;
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
        Movie savedMovie = movieRepository.saveAndFlush(newMovie);

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
                            .movie(savedMovie)
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
                                .movie(savedMovie)
                                .type(cc.getType())
                                .name(cc.getName())
                                .role(cc.getRole())
                                .characterName(cc.getCharacterName())
                                .build();
                    })
                    .toList();

            castCrewRepository.saveAll(castCrewEntities);
        }

        List<WatchLink> watchLinks = movie.getWatchLinks().stream()
                .map(w -> WatchLink.builder()
                        .movie(savedMovie)
                        .platform(w.getPlatform())
                        .url(w.getUrl())
                        .accessType(w.getAccessType().trim().toUpperCase())
                        .build()
                )
                .toList();

        watchLinkRepository.saveAll(watchLinks);

        List<MovieGenre> movieGenresFromDb =
                movieGenreRepository.findByMovieId(savedMovie.getId());

        List<CastCrew> castCrewFromDb =
                castCrewRepository.findByMovieId(savedMovie.getId());

        List<WatchLink> watchLinksFromDb =
                watchLinkRepository.findByMovieId(savedMovie.getId());

        MovieResponseDto response = modelMapper.map(newMovie,MovieResponseDto.class);

        response.setGenres(
                movieGenresFromDb.stream()
                        .map(mg -> new GenrePercentageDto(
                                mg.getGenre().getName(),
                                mg.getPercentage()
                        ))
                        .toList()
        );

        response.setCastCrew(
                castCrewFromDb.stream()
                        .map(cc -> new CastCrewDto(
                                cc.getType(),
                                cc.getName(),
                                cc.getRole(),
                                cc.getCharacterName()
                        ))
                        .toList()
        );

        response.setWatchLinks(
                watchLinksFromDb.stream()
                        .map(w -> new WatchLinkDto(
                                w.getPlatform(),
                                w.getUrl(),
                                w.getAccessType()
                        ))
                        .toList()
        );

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public MovieResponseDto getMovieBySlug(String movieUrl){
        Movie movie = movieRepository.findBySlugUrl(movieUrl)
                 .orElseThrow(() -> new MovieNotFoundException("Movie not found with slug: " + movieUrl));
        MovieResponseDto response = modelMapper.map(movie, MovieResponseDto.class);

        List<MovieGenre> movieGenres = movieGenreRepository.findByMovieId(movie.getId());
        List<CastCrew> castCrew = castCrewRepository.findByMovieId(movie.getId());
        List<WatchLink> watchLinks = watchLinkRepository.findByMovieId(movie.getId());

        response.setGenres(
                movieGenres.stream()
                        .map(mg -> new GenrePercentageDto(
                                mg.getGenre().getName(),
                                mg.getPercentage()
                        ))
                        .toList()
        );

        response.setCastCrew(
                castCrew.stream()
                        .map(cc -> new CastCrewDto(
                                cc.getType(),
                                cc.getName(),
                                cc.getRole(),
                                cc.getCharacterName()
                        ))
                        .toList()
        );

        response.setWatchLinks(
                watchLinks.stream()
                        .map(w -> new WatchLinkDto(
                                w.getPlatform(),
                                w.getUrl(),
                                w.getAccessType()
                        ))
                        .toList()
        );

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MovieResponseDto> findAllMovies(Pageable pageable){
        Page<Movie> moviePage = movieRepository.findAll(pageable);
        return moviePage.map(movie -> {
            MovieResponseDto response = modelMapper.map(movie, MovieResponseDto.class);

            List<MovieGenre> movieGenres = movieGenreRepository.findByMovieId(movie.getId());
            List<CastCrew> castCrew = castCrewRepository.findByMovieId(movie.getId());
            List<WatchLink> watchLinks = watchLinkRepository.findByMovieId(movie.getId());

            response.setGenres(
                    movieGenres.stream()
                            .map(mg -> new GenrePercentageDto(
                                    mg.getGenre().getName(),
                                    mg.getPercentage()
                            ))
                            .toList()
            );

            response.setCastCrew(
                    castCrew.stream()
                            .map(cc -> new CastCrewDto(
                                    cc.getType(),
                                    cc.getName(),
                                    cc.getRole(),
                                    cc.getCharacterName()
                            ))
                            .toList()
            );

            response.setWatchLinks(
                    watchLinks.stream()
                            .map(w -> new WatchLinkDto(
                                    w.getPlatform(),
                                    w.getUrl(),
                                    w.getAccessType()
                            ))
                            .toList()
            );

            return response;
        });
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

        if (movieRequest.getGenres() != null) {
            int total = movieRequest.getGenres().stream()
                    .mapToInt(GenrePercentageDto::getPercentage)
                    .sum();

            if (total != 100) {
                throw new IllegalArgumentException("Genre percentages must sum to 100, got: " + total);
            }

            movieGenreRepository.deleteByMovieId(movie.getId());

            List<MovieGenre> newGenres = movieRequest.getGenres().stream()
                    .map(g -> {
                        String normalizedName = g.getName().trim().toLowerCase();
                        Genre genre = genreRepository.findByName(normalizedName)
                                .orElseGet(() -> genreRepository.save(
                                        Genre.builder().name(normalizedName).build()
                                ));
                        return MovieGenre.builder()
                                .movie(movie)
                                .genre(genre)
                                .percentage(g.getPercentage())
                                .build();
                    })
                    .toList();
            movieGenreRepository.saveAll(newGenres);
        }

        if (movieRequest.getCastCrew() != null) {
            castCrewRepository.deleteByMovieId(movie.getId());

            List<CastCrew> newCastCrew = movieRequest.getCastCrew().stream()
                    .map(cc -> {
                        boolean hasRole = cc.getRole() != null;
                        boolean hasCharacterName = cc.getCharacterName() != null;

                        if (hasRole == hasCharacterName) {
                            throw new IllegalArgumentException(
                                    "Person '" + cc.getName() + "' must have either role (CREW) or characterName (CAST), not both or neither"
                            );
                        }


                        return CastCrew.builder()
                                .movie(movie)
                                .type(cc.getType())
                                .name(cc.getName())
                                .role(cc.getRole())
                                .characterName(cc.getCharacterName())
                                .build();
                    })
                    .toList();

            castCrewRepository.saveAll(newCastCrew);
        }

        if (movieRequest.getWatchLinks() != null) {
            watchLinkRepository.deleteByMovieId(movie.getId());

            List<WatchLink> newWatchLinks = movieRequest.getWatchLinks().stream()
                    .map(w -> WatchLink.builder()
                            .movie(movie)
                            .platform(w.getPlatform())
                            .url(w.getUrl())
                            .accessType(w.getAccessType().trim().toUpperCase())
                            .build())
                    .toList();

            watchLinkRepository.saveAll(newWatchLinks);
        }

        movieRepository.save(movie);

        List<MovieGenre> movieGenresFromDb = movieGenreRepository.findByMovieId(movie.getId());
        List<CastCrew> castCrewFromDb = castCrewRepository.findByMovieId(movie.getId());
        List<WatchLink> watchLinksFromDb = watchLinkRepository.findByMovieId(movie.getId());

        MovieResponseDto response = modelMapper.map(movie, MovieResponseDto.class);

        response.setGenres(
                movieGenresFromDb.stream()
                        .map(mg -> new GenrePercentageDto(
                                mg.getGenre().getName(),
                                mg.getPercentage()
                        ))
                        .toList()
        );

        response.setCastCrew(
                castCrewFromDb.stream()
                        .map(cc -> new CastCrewDto(
                                cc.getType(),
                                cc.getName(),
                                cc.getRole(),
                                cc.getCharacterName()
                        ))
                        .toList()
        );

        response.setWatchLinks(
                watchLinksFromDb.stream()
                        .map(w -> new WatchLinkDto(
                                w.getPlatform(),
                                w.getUrl(),
                                w.getAccessType()
                        ))
                        .toList()
        );

        return response;
    }

}
