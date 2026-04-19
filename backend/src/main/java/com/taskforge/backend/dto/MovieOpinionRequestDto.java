package com.taskforge.backend.dto;

import com.taskforge.backend.entity.OpinionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieOpinionRequestDto {
    private OpinionType opinionType;
}
