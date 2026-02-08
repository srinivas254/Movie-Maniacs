package com.taskforge.backend.dto;

import com.taskforge.backend.entity.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileUpdateResponseDto {
    private String message;
    private String name;
    private String bio;
    private String pictureUrl;

    private String instagram;
    private String twitter;
    private LocalDate dateOfBirth;
    private Gender gender;
}
