package com.taskforge.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDto {
    private String id;
    private String userName;
    private String name;
    private String email;

    private String provider;
    private String providerId;
    private String pictureUrl;

    private String bio;
    private String location;
    private String gender;

    private int followersCount;
    private int followingCount;
    private int postsCount;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    private boolean isPrivate;
}
