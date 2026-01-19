package com.taskforge.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.taskforge.backend.entity.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProfileUpdateRequestDto {
    private String name;
    private String bio;
    private String pictureUrl;

    private String instagram;
    private String twitter;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;
    private Gender gender;
}
