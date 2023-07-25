package com.project.attendanceleavemanagement.payload;

import javax.validation.constraints.NotBlank;

import com.project.attendanceleavemanagement.enums.RoleName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {

    @NotBlank
    private String usernameOrEmail;

    @NotBlank
    private String password;

}
