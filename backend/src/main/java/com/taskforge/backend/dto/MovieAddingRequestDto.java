package com.taskforge.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class MovieAddingRequestDto {

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Year is required")
    private Integer year;

    @NotNull(message = "Duration is required")
    private Integer duration;

    @NotBlank(message = "Director is required")
    private String directedBy;

    @NotBlank(message = "Country is required")
    private String country;

    @NotBlank(message = "Language is required")
    private String language;

    @NotBlank(message = "Age rating is required")
    private String ageRating;

    private String posterSmallUrl;
    private String posterWideUrl;

    @NotBlank(message = "Overview is required")
    private String overview;

    @NotNull(message = "At least one genre is required")
    @Size(min = 1, message = "At least one genre is required")
    private List<GenrePercentageDto> genres;

    @NotNull(message = "At least one cast or crew member is required")
    @Size(min = 1, message = "At least one cast or crew member is required")
    private List<CastCrewDto> castCrew;

    @NotNull(message = "At least one watch link is required")
    @Size(min = 1, message = "At least one watch link is required")
    private List<WatchLinkDto> watchLinks;
}
