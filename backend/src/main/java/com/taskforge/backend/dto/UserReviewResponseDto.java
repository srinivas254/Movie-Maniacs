package com.taskforge.backend.dto;

import com.taskforge.backend.entity.OpinionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
}
