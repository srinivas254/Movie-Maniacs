package com.taskforge.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCardResponseDto {
    private String id;
    private String userName;
    private String name;
    private String pictureUrl;
}
