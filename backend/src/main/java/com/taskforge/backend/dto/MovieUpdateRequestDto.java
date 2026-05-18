package com.taskforge.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieUpdateRequestDto {

    @Size(min = 1, message = "Name cannot be empty")
    private String name;

    @Min(value = 1888, message = "Invalid movie year")
    private Integer year;

    @Min(value = 1, message = "Duration must be greater than 0")
    private Integer duration;

    @Size(min = 1, message = "Director cannot be empty")
    private String directedBy;

    @Size(min = 1, message = "Country cannot be empty")
    private String country;

    @Size(min = 1, message = "Language cannot be empty")
    private String language;

    @Size(min = 1, message = "Age rating cannot be empty")
    private String ageRating;

    private String posterSmallUrl;

    private String posterWideUrl;

    @Size(min = 1, message = "Overview cannot be empty")
    private String overview;

    @Size(min = 1, message = "At least one genre is required")
    private List<GenrePercentageDto> genres;

    @Size(min = 1, message = "At least one cast or crew member is required")
    private List<CastCrewDto> castCrew;

    @Size(min = 1, message = "At least one watch link is required")
    private List<WatchLinkDto> watchLinks;
}
