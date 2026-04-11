package com.taskforge.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WatchLinkDto {
    @NotBlank(message = "Platform is required")
    private String platform;

    @NotBlank(message = "URL is required")
    private String url;

    @NotBlank(message = "Access type is required")
    private String accessType;
}
