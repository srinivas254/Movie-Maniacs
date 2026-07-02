package com.taskforge.backend.dto;

import com.taskforge.backend.entity.OpinionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserReviewResponseDto {
    private Long opinionId;
    private String movieName;
    private Integer year;
    private String smallPosterUrl;
    private String slugUrl;
    private OpinionType opinionType;
    private String comments;
    private boolean updated;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private long likesCount;
    private boolean likedByCurrentUser;
}
