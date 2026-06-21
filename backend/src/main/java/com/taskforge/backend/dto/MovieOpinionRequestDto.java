package com.taskforge.backend.dto;

import com.taskforge.backend.entity.OpinionType;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieOpinionRequestDto {

    @NotNull(message = "Opinion type is required")
    private OpinionType opinionType;

    @Size(max = 150, message = "Comments cannot exceed 150 characters")
    private String comments;
}
