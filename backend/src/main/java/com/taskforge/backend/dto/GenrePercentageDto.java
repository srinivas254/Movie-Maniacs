package com.taskforge.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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
public class GenrePercentageDto {
    @NotBlank(message = "Genre name is required")
    private String name;

    @NotNull(message = "Percentage is required")
    @Min(value = 1, message = "Percentage must be at least 1")
    @Max(value = 100, message = "Percentage cannot exceed 100")
    private Integer percentage;
}
