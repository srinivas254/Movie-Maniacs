package com.taskforge.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.taskforge.backend.entity.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDto {
    private String id;
    private String userName;
    private String name;

    private String pictureUrl;

    private String bio;

    private int followersCount;
    private int followingCount;

    private String instagram;
    private String twitter;
}
