package com.taskforge.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private String watchLink;
}
