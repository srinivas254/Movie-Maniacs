package com.taskforge.backend.service;

import com.taskforge.backend.dto.*;
import com.taskforge.backend.entity.*;
import com.taskforge.backend.exception.InvalidCastCrewException;
import com.taskforge.backend.exception.InvalidGenrePercentageException;
import com.taskforge.backend.exception.MovieNotFoundException;
import com.taskforge.backend.exception.UserNotFoundException;
import com.taskforge.backend.repository.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MovieServiceImpl implements MovieService {
    private final MovieRepository movieRepository;
    private final ModelMapper modelMapper;
    private final GenreRepository genreRepository;
    private final MovieGenreRepository movieGenreRepository;
    private final CastCrewRepository castCrewRepository;
    private final WatchLinkRepository watchLinkRepository;
    private final UserRepository userRepository;
    private final MovieInterestedRepository movieInterestedRepository;
    private final MovieOpinionRepository movieOpinionRepository;

    @Autowired
    public MovieServiceImpl(MovieRepository movieRepository,ModelMapper modelMapper, GenreRepository genreRepository, MovieGenreRepository movieGenreRepository, CastCrewRepository castCrewRepository, WatchLinkRepository watchLinkRepository, UserRepository userRepository, MovieInterestedRepository movieInterestedRepository, MovieOpinionRepository movieOpinionRepository){
        this.movieRepository = movieRepository;
        this.modelMapper = modelMapper;
        this.genreRepository = genreRepository;
        this.movieGenreRepository = movieGenreRepository;
        this.castCrewRepository = castCrewRepository;
        this.watchLinkRepository = watchLinkRepository;
        this.userRepository = userRepository;
        this.movieInterestedRepository = movieInterestedRepository;
        this.movieOpinionRepository = movieOpinionRepository;
    }

    @Override
    public MovieResponseDto saveMovie(MovieAddingRequestDto movie) {
        int total = movie.getGenres().stream()
                .mapToInt(GenrePercentageDto::getPercentage)
                .sum();
        if (total != 100) {
            throw new InvalidGenrePercentageException(total);
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
                            throw new InvalidCastCrewException(
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
                throw new InvalidGenrePercentageException(total);
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
                            throw new InvalidCastCrewException(
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

    @Override
    public InterestedStatusDto markInterested(String movieId, String userId) {

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() ->
                        new MovieNotFoundException("Movie not found with id:" + movieId));

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found with id:" + userId));

        boolean alreadyMarked =
                movieInterestedRepository
                        .existsByUserAndMovie(user, movie);

        if (alreadyMarked) {
            return InterestedStatusDto.builder()
                    .interested(true)
                    .build();
        }

        MovieInterested interest = new MovieInterested();

        interest.setMovie(movie);
        interest.setUser(user);

        movieInterestedRepository.save(interest);

        return InterestedStatusDto.builder()
                .interested(true)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public InterestedStatusDto getInterestedStatus(String movieId, String userId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() ->
                        new MovieNotFoundException("Movie not found with id: " + movieId));

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found with id: " + userId));

        boolean alreadyMarked =
                movieInterestedRepository.existsByUserAndMovie(user, movie);

        return InterestedStatusDto.builder()
                .interested(alreadyMarked)
                .build();
    }

    @Override
    public InterestedStatusDto removeInterested(String movieId, String userId) {

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() ->
                        new MovieNotFoundException("Movie not found with id: " + movieId));

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found with id: " + userId));

        boolean alreadyMarked =
                movieInterestedRepository.existsByUserAndMovie(user, movie);

        if (alreadyMarked) {
            movieInterestedRepository.deleteByUserAndMovie(user, movie);
        }

        return InterestedStatusDto.builder()
                .interested(false)
                .build();
    }

    @Override
    public MovieOpinionResponseDto submitOpinion(
            String movieId,
            String userId,
            OpinionType opinionType) {

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() ->
                        new MovieNotFoundException(
                                "Movie not found with id: " + movieId));

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with id: " + userId));

        Optional<MovieOpinion> existingOpinion =
                movieOpinionRepository.findByUserAndMovie(user, movie);

        if (existingOpinion.isPresent()) {

            MovieOpinion opinion = existingOpinion.get();

            opinion.setOpinionType(opinionType);

            movieOpinionRepository.save(opinion);

            return MovieOpinionResponseDto.builder()
                    .opinionType(opinionType)
                    .updated(true)
                    .build();
        }

        MovieOpinion opinion = new MovieOpinion();

        opinion.setMovie(movie);
        opinion.setUser(user);
        opinion.setOpinionType(opinionType);

        movieOpinionRepository.save(opinion);

        return MovieOpinionResponseDto.builder()
                .opinionType(opinionType)
                .updated(false)
                .build();
    }

    @Override
    public RetrieveMovieOpinionDto getUserOpinion(String movieId, String userId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() ->
                        new MovieNotFoundException(
                                "Movie not found with id: " + movieId));

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with id: " + userId));

        Optional<MovieOpinion> opinion =
                movieOpinionRepository.findByUserAndMovie(user, movie);

        if (opinion.isPresent()) {
            return RetrieveMovieOpinionDto.builder()
                    .opinionType(
                            opinion.get().getOpinionType()
                    )
                    .build();
        }

        return RetrieveMovieOpinionDto.builder()
                .opinionType(null)
                .build();
    }

    @Override
    public void deleteOpinion(String movieId, String userId) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() ->
                        new MovieNotFoundException(
                                "Movie not found with id: " + movieId));

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with id: " + userId));

        Optional<MovieOpinion> opinion =
                movieOpinionRepository.findByUserAndMovie(user, movie);

        if (opinion.isPresent()) {
            movieOpinionRepository.delete(opinion.get());
        }
    }

    @Override
    public MovieOpinionSummaryDto getOpinionSummary(
            String movieId) {

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() ->
                        new MovieNotFoundException(
                                "Movie not found with id: " + movieId));

        MovieOpinionSummaryDto dto =
                movieOpinionRepository.getMovieOpinionSummary(movieId);

        long total = dto.getTotalVotes();

        if (total == 0) {
            return MovieOpinionSummaryDto.builder()
                    .totalVotes(0)
                    .skipVotes(0)
                    .timePassVotes(0)
                    .goForItVotes(0)
                    .perfectionVotes(0)
                    .skipPercentage(0)
                    .timePassPercentage(0)
                    .goForItPercentage(0)
                    .perfectionPercentage(0)
                    .build();
        }

        return MovieOpinionSummaryDto.builder()
                .totalVotes(total)

                .skipVotes(dto.getSkipVotes())
                .timePassVotes(dto.getTimePassVotes())
                .goForItVotes(dto.getGoForItVotes())
                .perfectionVotes(dto.getPerfectionVotes())

                .skipPercentage((dto.getSkipVotes() * 100.0) / total)
                .timePassPercentage((dto.getTimePassVotes() * 100.0) / total)
                .goForItPercentage((dto.getGoForItVotes() * 100.0) / total)
                .perfectionPercentage((dto.getPerfectionVotes() * 100.0) / total)

                .build();
    }



}
