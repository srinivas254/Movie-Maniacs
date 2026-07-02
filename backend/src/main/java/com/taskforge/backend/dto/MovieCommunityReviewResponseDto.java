package com.taskforge.backend.dto;

import com.taskforge.backend.entity.OpinionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieCommunityReviewResponseDto {
    private Long opinionId;
    private String userName;
    private String pictureUrl;
    private OpinionType opinionType;
    private String comments;
    private boolean updated;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private long likesCount;
    private boolean likedByCurrentUser;
}
