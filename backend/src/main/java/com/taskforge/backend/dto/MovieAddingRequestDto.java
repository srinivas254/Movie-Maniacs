package com.taskforge.backend.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieAddingRequestDto {
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
    private String watchLink;
}
