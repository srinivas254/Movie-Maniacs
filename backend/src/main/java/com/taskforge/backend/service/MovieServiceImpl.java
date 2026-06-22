package com.taskforge.backend.service;

import com.taskforge.backend.dto.*;
import com.taskforge.backend.entity.*;
import com.taskforge.backend.exception.*;
import com.taskforge.backend.repository.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.Exception;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

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
    private final CollectionRepository collectionRepository;

    @Autowired
    public MovieServiceImpl(MovieRepository movieRepository,ModelMapper modelMapper, GenreRepository genreRepository, MovieGenreRepository movieGenreRepository, CastCrewRepository castCrewRepository, WatchLinkRepository watchLinkRepository, UserRepository userRepository, MovieInterestedRepository movieInterestedRepository, MovieOpinionRepository movieOpinionRepository, CollectionRepository collectionRepository){
        this.movieRepository = movieRepository;
        this.modelMapper = modelMapper;
        this.genreRepository = genreRepository;
        this.movieGenreRepository = movieGenreRepository;
        this.castCrewRepository = castCrewRepository;
        this.watchLinkRepository = watchLinkRepository;
        this.userRepository = userRepository;
        this.movieInterestedRepository = movieInterestedRepository;
        this.movieOpinionRepository = movieOpinionRepository;
        this.collectionRepository = collectionRepository;
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

        List<CastCrew> castCrewEntities = movie.getCastCrew().stream()
                .map(cc -> {
                    boolean hasRole = cc.getRole() != null;
                    boolean hasCharacterName = cc.getCharacterName() != null;

                    if (hasRole == hasCharacterName) {
                        throw new InvalidCastCrewException("Person '" + cc.getName() + "' must have either role (CREW) or characterName (CAST), not both or neither");
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
    public MovieResponseDto updateMovieById(String id,MovieUpdateRequestDto movieRequest) {
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
            MovieOpinionRequestDto request) {

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

            opinion.setOpinionType(request.getOpinionType());
            opinion.setComments(request.getComments());

            movieOpinionRepository.save(opinion);

            return MovieOpinionResponseDto.builder()
                    .opinionType(opinion.getOpinionType())
                    .comments(opinion.getComments())
                    .updated(true)
                    .build();
        }

        MovieOpinion opinion = new MovieOpinion();

        opinion.setMovie(movie);
        opinion.setUser(user);
        opinion.setOpinionType(request.getOpinionType());
        opinion.setComments(request.getComments());

        movieOpinionRepository.save(opinion);

        return MovieOpinionResponseDto.builder()
                .opinionType(opinion.getOpinionType())
                .comments(opinion.getComments())
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

        MovieOpinion movieOpinion = movieOpinionRepository
                .findByUserAndMovie(user, movie)
                .orElse(null);

        if (movieOpinion == null) {
            return null;
        }

        return RetrieveMovieOpinionDto.builder()
                .opinionType(movieOpinion.getOpinionType())
                .comments(movieOpinion.getComments())
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

        movieOpinionRepository.findByUserAndMovie(user, movie)
                .ifPresent(movieOpinionRepository::delete);
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

    @Override
    public List<MovieCardResponseDto> searchMovies(String query) {

        List<Movie> movies =
                movieRepository
                        .findByNameStartingWithIgnoreCase(query);

        return movies.stream()
                .map(movie -> new MovieCardResponseDto(
                        movie.getId(),
                        movie.getName(),
                        movie.getYear(),
                        movie.getPosterSmallUrl(),
                        movie.getSlugUrl()
                ))
                .toList();
    }

    @Override
    public void createCollection(CreateCollectionRequestDto request, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (collectionRepository.existsByName(request.getName())) {
            throw new CollectionAlreadyExistsException(
                    "Collection name already exists");
        }

        Collection collection = new Collection();

        collection.setName(request.getName());
        collection.setDescription(request.getDescription());
        collection.setVisibility(request.getVisibility());
        collection.setUser(user);

        collectionRepository.save(collection);
    }

    @Override
    public MsgResponseDto updateCollection(String collectionName, EditCollectionRequestDto request, String userId) {

        Collection collection =
                collectionRepository
                        .findByNameAndUserId(collectionName, userId)
                        .orElseThrow(() ->
                                new CollectionNotFoundException(
                                        "Collection not found"));

        collection.setName(request.getName());
        collection.setDescription(request.getDescription());
        collection.setVisibility(request.getVisibility());

        collectionRepository.save(collection);

        return new MsgResponseDto("Collection updated successfully");
    }

    @Override
    public List<CollectionCardDto> getMyCollections(String userId) {

        List<Collection> collections = collectionRepository.findByUserId(userId);

        return collections.stream()
                .map(collection -> new CollectionCardDto(
                        collection.getId(),
                        collection.getName(),
                        collection.getVisibility(),
                        collection.getMovies().size()
                ))
                .toList();
    }

    @Override
    public CollectionDetailsResponseDto getCollectionDetails(String collectionName, String userId) {

        Collection collection =
                collectionRepository
                        .findByNameAndUserId(collectionName, userId)
                        .orElseThrow(() -> new CollectionNotFoundException("Collection not found"));

        List<MovieCardResponseDto> movies =
                collection.getMovies()
                        .stream()
                        .map(movie -> {
                            MovieCardResponseDto dto = new MovieCardResponseDto();
                            dto.setId(movie.getId());
                            dto.setName(movie.getName());
                            dto.setYear(movie.getYear());
                            dto.setPosterSmallUrl(movie.getPosterSmallUrl());
                            dto.setSlugUrl(movie.getSlugUrl());
                            return dto;
                        }).toList();

        CollectionDetailsResponseDto dto = new CollectionDetailsResponseDto();
        dto.setId(collection.getId());
        dto.setName(collection.getName());
        dto.setDescription(collection.getDescription());
        dto.setVisibility(collection.getVisibility());
        dto.setMovies(movies);
        dto.setItemsCount(movies.size());

        return dto;
    }

    @Override
    public MsgResponseDto addMovieToCollection(String collectionName, String movieId, String userId) {

        Collection collection =
                collectionRepository
                        .findByNameAndUserId(collectionName, userId)
                        .orElseThrow(() ->
                                new CollectionNotFoundException("Collection not found"));

        Movie movie =
                movieRepository
                        .findById(movieId)
                        .orElseThrow(() ->
                                new MovieNotFoundException("Movie not found"));

        boolean alreadyExists =
                collection.getMovies()
                        .stream()
                        .anyMatch(m -> m.getId().equals(movieId));

        if (alreadyExists) {
            throw new MovieExistsException("Movie already exists in collection");
        }

        collection.getMovies().add(movie);
        collectionRepository.save(collection);

        return new MsgResponseDto("Movie added to collection successfully");
    }

    @Override
    public void removeMovieFromCollection(String collectionName, String movieId, String userId) {
        Collection collection =
                collectionRepository
                        .findByNameAndUserId(collectionName, userId)
                        .orElseThrow(() ->
                                new CollectionNotFoundException("Collection not found"));

        Movie movie =
                movieRepository
                        .findById(movieId)
                        .orElseThrow(() ->
                                new MovieNotFoundException("Movie not found"));

        boolean movieExists =
                collection.getMovies()
                        .stream()
                        .anyMatch(m -> m.getId().equals(movieId));

        if (!movieExists) {
            throw new MovieNotFoundException(
                    "Movie is not present in this collection");
        }

        collection.getMovies().remove(movie);
        collectionRepository.save(collection);
    }

    @Override
    public void updateCollectionMovies(String collectionName, List<String> movieIds, String userId) {
        Collection collection = collectionRepository
                .findByNameAndUserId(collectionName, userId)
                .orElseThrow(() -> new CollectionNotFoundException("Collection not found"));

        List<Movie> movies = movieRepository.findAllById(movieIds);

        collection.setMovies(movies);
        collectionRepository.save(collection);
    }

    @Override
    public void deleteCollection(String collectionName, String userId) {
        Collection collection = collectionRepository
                .findByNameAndUserId(collectionName, userId)
                .orElseThrow(() -> new CollectionNotFoundException("Collection not found"));

        collectionRepository.delete(collection);
    }

    @Override
    public List<CollectionSummaryDto> getCollectionsContainingMovie(String movieId, String userId){
        List<Collection> collections =
                collectionRepository.findByUserId(userId);

        return collections.stream()
                .filter(collection ->
                        collection.getMovies().stream()
                                .anyMatch(movie ->
                                        movie.getId().equals(movieId)
                                )
                )
                .map(collection ->
                        new CollectionSummaryDto(
                                collection.getId(),
                                collection.getName()
                        )
                )
                .toList();
    }

    @Override
    public List<MovieCardResponseDto> getEditorsPicks(String userId) {
        List<String> editorPickIds = List.of(
                "bfdc4a0d-0d2f-4dc8-8039-b489885f1435",
                "c662d00c-d2a4-4e5d-b742-a72399e8bbb8",
                "c6c4e7fe-69d7-4d30-9fd2-11fdae7ea941",
                "da76bc2a-e375-49b2-9dd2-8b42a83e6de5",
                "f78b1f6d-3861-4ace-b064-40aec7e517eb"
        );

        List<Movie> movies = movieRepository.findAllById(editorPickIds);

        return movies.stream()
                .map(movie -> new MovieCardResponseDto(
                        movie.getId(),
                        movie.getName(),
                        movie.getYear(),
                        movie.getPosterSmallUrl(),
                        movie.getSlugUrl()
                ))
                .toList();
    }

    @Override
    public List<MovieCardResponseDto> getNetflixPicks(String userId) {
        List<String> netflixPickIds = List.of(
                "7bfd7a36-f53c-4a7f-92de-4964ba1e50d5",
                "3f3b7f8e-b88e-4034-bdc2-17961b13d83e",
                "2bd5734c-ed98-44da-b87c-cdc8d3ebb55d",
                "3379c6e9-e970-4454-bc15-1608fd6dd2d6",
                "488133df-731a-4241-83d0-33ded287dcbc"
        );

        List<Movie> movies = movieRepository.findAllById(netflixPickIds);

        return movies.stream()
                .map(movie -> new MovieCardResponseDto(
                        movie.getId(),
                        movie.getName(),
                        movie.getYear(),
                        movie.getPosterSmallUrl(),
                        movie.getSlugUrl()
                ))
                .toList();
    }

    @Override
    public List<MovieCardResponseDto> getPrimePicks(String userId) {
        List<String> primePickIds = List.of(
                "d929340f-f00a-471e-974a-5ebf304e9272",
                "6bdcf46e-2b04-409c-bb11-501505d5f84b",
                "09d52398-c825-42ff-8b5c-f09e48cb8321",
                "6bacb343-8767-4d6b-9680-3fb568b9fe19",
                "cfcd93e9-5b1c-490a-bf05-7f18f580119f"
        );

        List<Movie> movies = movieRepository.findAllById(primePickIds);

        return movies.stream()
                .map(movie -> new MovieCardResponseDto(
                        movie.getId(),
                        movie.getName(),
                        movie.getYear(),
                        movie.getPosterSmallUrl(),
                        movie.getSlugUrl()
                ))
                .toList();
    }

    @Override
    public List<MovieCardResponseDto> getJioPicks(String userId) {
        List<String> jioPickIds = List.of(
                "d929340f-f00a-471e-974a-5ebf304e9272",
                "6bdcf46e-2b04-409c-bb11-501505d5f84b",
                "09d52398-c825-42ff-8b5c-f09e48cb8321",
                "6bacb343-8767-4d6b-9680-3fb568b9fe19",
                "2f672d4d-5040-4890-adda-5f0d21fa8a94"
        );

        List<Movie> movies = movieRepository.findAllById(jioPickIds);

        return movies.stream()
                .map(movie -> new MovieCardResponseDto(
                        movie.getId(),
                        movie.getName(),
                        movie.getYear(),
                        movie.getPosterSmallUrl(),
                        movie.getSlugUrl()
                ))
                .toList();
    }

    @Override
    public List<MovieCardResponseDto> getApplePicks(String userId) {
        List<String> applePickIds = List.of(
                "d929340f-f00a-471e-974a-5ebf304e9272",
                "6bacb343-8767-4d6b-9680-3fb568b9fe19",
                "adaa9e8e-4472-4b66-9b9e-dca80e20221e",
                "d4eed5e5-2e0f-4105-a6e8-f7801ae1a80b",
                "cfcd93e9-5b1c-490a-bf05-7f18f580119f"
        );

        List<Movie> movies = movieRepository.findAllById(applePickIds);

        return movies.stream()
                .map(movie -> new MovieCardResponseDto(
                        movie.getId(),
                        movie.getName(),
                        movie.getYear(),
                        movie.getPosterSmallUrl(),
                        movie.getSlugUrl()
                ))
                .toList();
    }

    @Override
    public List<TopInterestedMovieResponseDto> getTopInterestedMovies(String userId) {

        List<TopInterestedMovieDto> topMovies =
                movieInterestedRepository.findTopInterestedMovies()
                        .stream()
                        .map(row -> new TopInterestedMovieDto(
                                (String) row[0],
                                ((Number) row[1]).longValue()
                        ))
                        .toList();

        List<String> movieIds = topMovies.stream()
                .map(TopInterestedMovieDto::getMovieId)
                .toList();

        List<Movie> movies = movieRepository.findAllById(movieIds);

        Map<String, Movie> movieMap = movies.stream()
                .collect(Collectors.toMap(
                        Movie::getId,
                        Function.identity()
                ));

        Map<String, Long> interestedCountMap = topMovies.stream()
                .collect(Collectors.toMap(
                        TopInterestedMovieDto::getMovieId,
                        TopInterestedMovieDto::getInterestedCount
                ));

        return movieIds.stream()
                .map(movieId -> {

                    Movie movie = movieMap.get(movieId);

                    if (movie == null) {
                        throw new MovieNotFoundException(
                                "Movie not found with id: " + movieId
                        );
                    }

                    TopInterestedMovieResponseDto dto =
                            new TopInterestedMovieResponseDto();

                    dto.setId(movie.getId());
                    dto.setName(movie.getName());
                    dto.setYear(movie.getYear());
                    dto.setPosterSmallUrl(movie.getPosterSmallUrl());
                    dto.setSlugUrl(movie.getSlugUrl());
                    dto.setInterestedCount(
                            interestedCountMap.get(movieId)
                    );

                    return dto;
                })
                .toList();
    }

}
