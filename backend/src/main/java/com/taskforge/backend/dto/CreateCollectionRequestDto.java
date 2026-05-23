package com.taskforge.backend.dto;

import com.taskforge.backend.entity.Visibility;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateCollectionRequestDto {

    @NotBlank(message = "Collection name is required")
    @Size(max = 30, message = "Collection name cannot exceed 30 characters")
    private String name;

    @Size(max = 150, message = "Description cannot exceed 150 characters")
    private String description;

    @NotNull(message = "Visibility is required")
    private Visibility visibility;
}
