package com.taskforge.backend.dto;

import com.taskforge.backend.entity.PersonType;
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
public class CastCrewDto {
    @NotNull(message = "Person type is required")
    private PersonType type;

    @NotBlank(message = "Name is required")
    private String name;

    private String role;          // for CREW
    private String characterName; // for CAST
}
