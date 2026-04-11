package com.taskforge.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieResponseDto {
    private String id;
    private String slugUrl;
    private String name;
    private Integer year;
    private Integer duration;
    private String directedBy;
    private String country;
    private String language;
    private String ageRating;

    private String posterSmallUrl;
    private String posterWideUrl;

    private String overview;

    private List<GenrePercentageDto> genres;
    private List<CastCrewDto> castCrew;
    private List<WatchLinkDto> watchLinks;
}
