package com.taskforge.backend.dto;

import com.taskforge.backend.entity.OpinionType;
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
}
