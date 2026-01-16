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

@Service
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
    public NameUpdateResponseDto updateNameById(String id, String name){
        User euser = userRepository.findById(id).orElseThrow(() ->
                new UserNotFoundException("User not found with id "+ id));
        euser.setName(name);
        User updatedUser = userRepository.save(euser);
        return modelMapper.map(updatedUser, NameUpdateResponseDto.class);
    }

}
