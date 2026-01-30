package com.taskforge.backend.service;

import com.taskforge.backend.dto.*;
import com.taskforge.backend.entity.User;
import com.taskforge.backend.exception.*;
import com.taskforge.backend.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserServiceImpl implements UserService{
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public UserServiceImpl(UserRepository userRepository,ModelMapper modelMapper) {
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public UserResponseDto findUserById(String id){
        User user = userRepository.findById(id).orElseThrow(() ->
                new UserNotFoundException("User not found with userName "+ id));
        return modelMapper.map(user,UserResponseDto.class);
    }

    @Override
    public Page<UserResponseDto> findAllUsers(Pageable pageable){
        Page<User> userpage = userRepository.findAll(pageable);
        return userpage.map( user -> modelMapper.map(user, UserResponseDto.class));
    }

    @Override
    public void deleteUserById(String id){
        User user = userRepository.findById(id).orElseThrow(() ->
                new UserNotFoundException("User not found with id "+ id));
        userRepository.delete(user);
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

        if (profileUpdateRequestDto.getBio() != null) {
            euser.setBio(profileUpdateRequestDto.getBio());
        }

        if (profileUpdateRequestDto.getPictureUrl() != null) {
            euser.setPictureUrl(profileUpdateRequestDto.getPictureUrl());
        }

        if (profileUpdateRequestDto.getDateOfBirth() != null) {
            euser.setDateOfBirth(profileUpdateRequestDto.getDateOfBirth());
        }

        if (profileUpdateRequestDto.getGender() != null) {
            euser.setGender(profileUpdateRequestDto.getGender());
        }

        if (profileUpdateRequestDto.getInstagram() != null) {
            euser.setInstagram(profileUpdateRequestDto.getInstagram());
        }

        if (profileUpdateRequestDto.getTwitter() != null) {
            euser.setTwitter(profileUpdateRequestDto.getTwitter());
        }

        User updatedUser = userRepository.save(euser);
        ProfileUpdateResponseDto response = modelMapper.map(updatedUser, ProfileUpdateResponseDto.class);

        response.setMessage("Profile updated successfully");
        return response;
    }

}
