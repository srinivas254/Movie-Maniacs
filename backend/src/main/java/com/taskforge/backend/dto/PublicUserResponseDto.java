package com.taskforge.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PublicUserResponseDto {
    private String userName;
    private String name;
    private String pictureUrl;
    private String bio;
    private int followersCount;
    private int followingCount;
    private String instagram;
    private String twitter;
}
