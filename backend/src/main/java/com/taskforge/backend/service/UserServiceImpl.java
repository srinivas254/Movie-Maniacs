package com.taskforge.backend.service;

import com.taskforge.backend.dto.*;
import com.taskforge.backend.entity.*;
import com.taskforge.backend.exception.*;
import com.taskforge.backend.repository.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@Transactional
public class UserServiceImpl implements UserService{
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final MovieInterestedRepository movieInterestedRepository;
    private final MovieOpinionRepository movieOpinionRepository;
    private final CollectionRepository collectionRepository;
    private final SavedCollectionRepository savedCollectionRepository;
    private final MovieOpinionLikeRepository movieOpinionLikeRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository,ModelMapper modelMapper,PasswordEncoder passwordEncoder,MovieInterestedRepository movieInterestedRepository, MovieOpinionRepository movieOpinionRepository, CollectionRepository collectionRepository, SavedCollectionRepository savedCollectionRepository, MovieOpinionLikeRepository movieOpinionLikeRepository) {
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
        this.passwordEncoder = passwordEncoder;
        this.movieInterestedRepository = movieInterestedRepository;
        this.movieOpinionRepository = movieOpinionRepository;
        this.collectionRepository = collectionRepository;
        this.savedCollectionRepository = savedCollectionRepository;
        this.movieOpinionLikeRepository = movieOpinionLikeRepository;
    }

    @Override
    public UserResponseDto findUserById(String id){
        User user = userRepository.findById(id).orElseThrow(() ->
                new UserNotFoundException("User not found with userName "+ id));

        UserResponseDto dto = modelMapper.map(user, UserResponseDto.class);
        dto.setHasPassword(user.getPassword() != null);

        return dto;
    }

    @Override
    public PublicUserResponseDto findByUserName(String userName) {
        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new UserNotFoundException("User not found with userName "+ userName));

        return modelMapper.map(user, PublicUserResponseDto.class);
    }


    @Override
    public Page<UserResponseDto> findAllUsers(Pageable pageable){
        Page<User> userpage = userRepository.findByRole(Role.USER, pageable);
        return userpage.map( user -> modelMapper.map(user, UserResponseDto.class));
    }

    @Override
    public void deleteUserById(String id,String password){
        User user = userRepository.findById(id).orElseThrow(() ->
                new UserNotFoundException("User not found with id "+ id));

        if(user.getPassword() == null){
            throw new PasswordNotSetException("Please set a password before deleting account");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidPasswordException("Incorrect password");
        }

        userRepository.delete(user);
    }

    private String normalize(String value) {
        return (value == null || value.isBlank()) ? null : value;
    }

    @Override
    public ProfileUpdateResponseDto updateProfileById(String id, ProfileUpdateRequestDto profileUpdateRequestDto){
        User euser = userRepository.findById(id).orElseThrow(() ->
                new UserNotFoundException("User not found with id "+ id));

        if (profileUpdateRequestDto.getName() != null) {
            if (profileUpdateRequestDto.getName().isBlank()) {
                throw new IllegalArgumentException("Name cannot be empty");
            }
            euser.setName(profileUpdateRequestDto.getName());
        }

        String bio = normalize(profileUpdateRequestDto.getBio());
        if (bio != null) euser.setBio(bio);

        String pictureUrl = normalize(profileUpdateRequestDto.getPictureUrl());
        if (pictureUrl != null) euser.setPictureUrl(pictureUrl);

        if (profileUpdateRequestDto.getDateOfBirth() != null) {
            euser.setDateOfBirth(profileUpdateRequestDto.getDateOfBirth());
        }

        if (profileUpdateRequestDto.getGender() != null) {
            euser.setGender(profileUpdateRequestDto.getGender());
        }

        String instagram = normalize(profileUpdateRequestDto.getInstagram());
        if (instagram != null) euser.setInstagram(instagram);

        String twitter = normalize(profileUpdateRequestDto.getTwitter());
        if (twitter != null) euser.setTwitter(twitter);

        User updatedUser = userRepository.save(euser);
        ProfileUpdateResponseDto response = modelMapper.map(updatedUser, ProfileUpdateResponseDto.class);

        response.setHasPassword(euser.getPassword() != null);
        response.setMessage("Profile updated successfully");
        return response;
    }

    @Override
    public MsgResponseDto setPassword(String id, String newPassword){

        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id "+ id));

        if(user.getPassword() != null){
            throw new PasswordAlreadyExistsException("Password already exists. Use reset password.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return new MsgResponseDto("Password set successfully");
    }

    @Override
    public MsgResponseDto resetPassword(String id, ResetPasswordRequestDto request) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id " + id));

        if (user.getPassword() == null) {
            throw new PasswordNotSetException("Password not set. Use set password first.");
        }

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new InvalidPasswordException("Old password is incorrect");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new PasswordAlreadyExistsException(
                    "New password must be different from old password"
            );
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new ConfirmPasswordMismatchException("New password and confirm password do not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return new MsgResponseDto("Password updated successfully");
    }

    @Override
    public List<UserCardResponseDto> searchUsers(String query) {

        List<User> users =
                userRepository
                        .findByNameStartingWithIgnoreCaseAndRole(query,Role.USER);

        return users.stream()
                .map(user -> new UserCardResponseDto(
                        user.getId(),
                        user.getUserName(),
                        user.getName(),
                        user.getPictureUrl()
                ))
                .toList();
    }

    @Override
    public List<MovieCardResponseDto> getMyInterestedMovies(String userId) {

        return movieInterestedRepository.findByUserId(userId)
                .stream()
                .map(movieInterested -> {
                    Movie movie = movieInterested.getMovie();

                    return new MovieCardResponseDto(
                            movie.getId(),
                            movie.getName(),
                            movie.getYear(),
                            movie.getPosterSmallUrl(),
                            movie.getSlugUrl()
                    );
                })
                .toList();
    }

    @Override
    public List<MovieCardResponseDto> getUserInterestedMovies(String userName) {

        User user = userRepository.findByUserName(userName)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with username: " + userName));

        return movieInterestedRepository.findByUserId(user.getId())
                .stream()
                .map(movieInterested -> {
                    Movie movie = movieInterested.getMovie();

                    return new MovieCardResponseDto(
                            movie.getId(),
                            movie.getName(),
                            movie.getYear(),
                            movie.getPosterSmallUrl(),
                            movie.getSlugUrl()
                    );
                })
                .toList();
    }

    @Override
    public List<UserReviewResponseDto> getMyReviews(String userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with id: " + userId));

        List<MovieOpinion> opinions =
                movieOpinionRepository.findByUserId(user.getId());

        return opinions.stream()
                .map(opinion -> {

                    Movie movie = opinion.getMovie();

                    long likesCount = movieOpinionLikeRepository
                            .countByMovieOpinion(opinion);

                    boolean likedByCurrentUser = movieOpinionLikeRepository
                            .existsByMovieOpinionAndUser(opinion, user);

                    return new UserReviewResponseDto(
                            opinion.getId(),
                            movie.getName(),
                            movie.getYear(),
                            movie.getPosterSmallUrl(),
                            movie.getSlugUrl(),
                            opinion.getOpinionType(),
                            opinion.getComments(),
                            opinion.isUpdated(),
                            opinion.getCreatedAt(),
                            opinion.getUpdatedAt(),
                            likesCount,
                            likedByCurrentUser
                    );
                })
                .toList();
    }

    @Override
    public List<PublicCollectionResponseDto> getMyPublicCollections(String userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with id: " + userId));

        List<Collection> collections =
                collectionRepository.findByUserIdAndVisibility(
                        user.getId(),
                        Visibility.PUBLIC
                );

        return collections.stream()
                .map(collection -> new PublicCollectionResponseDto(
                        collection.getId(),
                        collection.getName(),
                        collection.getMovies().size()
                ))
                .toList();
    }

    @Override
    public List<UserReviewResponseDto> getUserReviews(String userName, String currentUserId) {

        User profileOwner = userRepository.findByUserName(userName)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with username: " + userName));

        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with id: " + currentUserId));

        List<MovieOpinion> opinions =
                movieOpinionRepository.findByUserId(profileOwner.getId());

        return opinions.stream()
                .map(opinion -> {

                    Movie movie = opinion.getMovie();

                    long likesCount = movieOpinionLikeRepository
                            .countByMovieOpinion(opinion);

                    boolean likedByCurrentUser = movieOpinionLikeRepository
                            .existsByMovieOpinionAndUser(opinion, currentUser);

                    return new UserReviewResponseDto(
                            opinion.getId(),
                            movie.getName(),
                            movie.getYear(),
                            movie.getPosterSmallUrl(),
                            movie.getSlugUrl(),
                            opinion.getOpinionType(),
                            opinion.getComments(),
                            opinion.isUpdated(),
                            opinion.getCreatedAt(),
                            opinion.getUpdatedAt(),
                            likesCount,
                            likedByCurrentUser
                    );
                })
                .toList();
    }

    @Override
    public List<PublicCollectionResponseDto> getPublicCollections(String userName) {

        User user = userRepository.findByUserName(userName)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with username: " + userName));

        List<Collection> collections =
                collectionRepository.findByUserIdAndVisibility(
                        user.getId(),
                        Visibility.PUBLIC
                );

        return collections.stream()
                .map(collection -> new PublicCollectionResponseDto(
                        collection.getId(),
                        collection.getName(),
                        collection.getMovies().size()
                ))
                .toList();
    }

    @Override
    public PublicCollectionDetailsResponseDto getPublicCollectionDetails(String userName, String collectionName) {

        User user = userRepository.findByUserName(userName)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found with username: " + userName));

        Collection collection = collectionRepository
                .findByNameAndUserId(collectionName, user.getId())
                .orElseThrow(() ->
                        new CollectionNotFoundException("Collection not found"));

        if (collection.getVisibility() != Visibility.PUBLIC) {
            throw new AccessDeniedException("This collection is private.");
        }

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

        PublicCollectionDetailsResponseDto dto = new PublicCollectionDetailsResponseDto();
        dto.setName(collection.getName());
        dto.setDescription(collection.getDescription());
        dto.setItemsCount(movies.size());
        dto.setMovies(movies);

        return dto;
    }

    @Override
    public void savePublicCollection(String userName, String collectionName, String userId) {

        User owner = userRepository.findByUserName(userName)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found."));

        Collection collection = collectionRepository
                .findByNameAndUserId(collectionName, owner.getId())
                .orElseThrow(() ->
                        new CollectionNotFoundException("Collection not found."));

        if (collection.getVisibility() != Visibility.PUBLIC) {
            throw new CollectionNotPublicException("Collection is private.");
        }

        if (owner.getId().equals(userId)) {
            throw new IllegalArgumentException(
                    "You cannot save your own collection.");
        }

        User currentUser = userRepository.findById(userId)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found."));

        if (savedCollectionRepository.existsByUserIdAndCollectionId(
                currentUser.getId(), collection.getId())) {

            throw new CollectionAlreadySavedException("Collection already saved.");
        }

        SavedCollection savedCollection = new SavedCollection();
        savedCollection.setUser(currentUser);
        savedCollection.setCollection(collection);

        savedCollectionRepository.save(savedCollection);
    }

    @Override
    public void removePublicSavedCollection(String userName, String collectionName, String userId) {

        User owner = userRepository.findByUserName(userName)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found."));

        Collection collection = collectionRepository
                .findByNameAndUserId(collectionName, owner.getId())
                .orElseThrow(() ->
                        new CollectionNotFoundException("Collection not found."));

        SavedCollection savedCollection = savedCollectionRepository
                .findByUserIdAndCollectionId(userId, collection.getId())
                .orElseThrow(() ->
                        new CollectionNotFoundException("Public Collection is not saved."));

        savedCollectionRepository.delete(savedCollection);
    }

    @Override
    public List<SavedCollectionCardDto> getSavedCollections(String userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found."));

        List<SavedCollection> savedCollections =
                savedCollectionRepository.findByUserId(user.getId());

        return savedCollections.stream()
                .map(savedCollection -> {
                    Collection collection = savedCollection.getCollection();

                    return new SavedCollectionCardDto(
                            collection.getId(),
                            collection.getName(),
                            collection.getMovies().size(),
                            collection.getUser().getUserName()
                    );
                })
                .toList();
    }

    @Override
    public CollectionSavedStatusDto isCollectionSaved(String userName, String collectionName, String userId) {
        User owner = userRepository.findByUserName(userName)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found."));

        Collection collection = collectionRepository
                .findByNameAndUserId(collectionName, owner.getId())
                .orElseThrow(() ->
                        new CollectionNotFoundException("Collection not found."));

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found."));

        boolean saved = savedCollectionRepository
                .existsByUserIdAndCollectionId(user.getId(), collection.getId());

        return new CollectionSavedStatusDto(saved);
    }

}
