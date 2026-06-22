package com.taskforge.backend.service;

import com.taskforge.backend.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {
    UserResponseDto findUserById(String id);
    PublicUserResponseDto findByUserName(String userName);
    Page<UserResponseDto> findAllUsers(Pageable pageable);
    void deleteUserById(String id,String password);
    ProfileUpdateResponseDto updateProfileById(String id, ProfileUpdateRequestDto profileUpdateRequestDto);
    MsgResponseDto setPassword(String id,String newPassword);
    MsgResponseDto resetPassword(String id,ResetPasswordRequestDto request);
    List<UserCardResponseDto> searchUsers(String query);
    List<MovieCardResponseDto> getMyInterestedMovies(String userId);
    List<MovieCardResponseDto> getUserInterestedMovies(String userName);
    List<UserReviewResponseDto> getMyReviews(String userId);
    List<PublicCollectionResponseDto> getMyPublicCollections(String userId);
    List<UserReviewResponseDto> getUserReviews(String userName);
    List<PublicCollectionResponseDto> getPublicCollections(String userName);
}
