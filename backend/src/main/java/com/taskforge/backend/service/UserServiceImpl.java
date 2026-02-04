package com.taskforge.backend.service;

import com.taskforge.backend.dto.*;
import com.taskforge.backend.entity.User;
import com.taskforge.backend.exception.*;
import com.taskforge.backend.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserServiceImpl implements UserService{
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository,ModelMapper modelMapper,PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
        this.passwordEncoder = passwordEncoder;
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

    @Override
    public MsgResponseDto updateProfileById(String id, ProfileUpdateRequestDto profileUpdateRequestDto){
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
        MsgResponseDto response = modelMapper.map(updatedUser, MsgResponseDto.class);

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

        User updatedUser = userRepository.save(user);
        MsgResponseDto response = modelMapper.map(updatedUser, MsgResponseDto.class);

        response.setMessage("Password set successfully");
        return response;
    }

    @Override
    public MsgResponseDto resetPassword(String id, ResetPasswordRequestDto request) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id " + id));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new InvalidPasswordException("Old password is incorrect");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new ConfirmPasswordMismatchException("New password and confirm password do not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        User updatedUser = userRepository.save(user);
        MsgResponseDto response = modelMapper.map(updatedUser, MsgResponseDto.class);
        response.setMessage("Password updated successfully");
        return response;
    }

}
