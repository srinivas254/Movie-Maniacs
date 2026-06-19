package com.taskforge.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopInterestedMovieResponseDto {
    private String id;
    private String name;
    private Integer year;
    private String posterSmallUrl;
    private String slugUrl;
    private Long interestedCount;
}
