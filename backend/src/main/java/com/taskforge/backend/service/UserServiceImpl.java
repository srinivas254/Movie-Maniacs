package com.taskforge.backend.service;

import com.taskforge.backend.dto.*;
import com.taskforge.backend.entity.Role;
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

        UserResponseDto dto = modelMapper.map(user, UserResponseDto.class);
        dto.setHasPassword(user.getPassword() != null);

        return dto;
    }

    @Override
    public UserResponseDto findByUserName(String userName) {
        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new UserNotFoundException("User not found with userName "+ userName));

        UserResponseDto dto = modelMapper.map(user, UserResponseDto.class);
        dto.setHasPassword(user.getPassword() != null);

        return dto;
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

}
