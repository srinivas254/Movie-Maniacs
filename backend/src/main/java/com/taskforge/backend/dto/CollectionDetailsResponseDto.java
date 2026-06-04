package com.taskforge.backend.dto;

import com.taskforge.backend.entity.Visibility;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CollectionDetailsResponseDto {
    private Long id;
    private String name;
    private String description;
    private Visibility visibility;
    private int itemsCount;
    private LocalDateTime updatedAt;
    private List<MovieCardResponseDto> movies;
}
