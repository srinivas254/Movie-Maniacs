package com.taskforge.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRegistrationRequestDto {
    @NotBlank(message = "Name cannot be blank")
    private String name;
    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email is invalid")
    private String email;
    @NotBlank(message = "Username cannot be blank")
    @Size(min = 10, message = "Username must be at least 10 characters long")
    @Pattern(
            regexp = "^[a-z][^@]*$",
            message = "Username must start with a lowercase letter and must not contain '@'"
    )
    private String userName;
    @NotBlank(message = "Password cannot be blank")
    @Pattern(regexp = "^(?!.*\\s)(?=[a-zA-Z])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{10,}$",
            message = "The password must be minimum 10 characters. It should not begin with a number or special character." +
                    "There must be minimum 1 small,1 capital,1 number and 1 special character. There must be no whitespaces")
    private String password;
}
