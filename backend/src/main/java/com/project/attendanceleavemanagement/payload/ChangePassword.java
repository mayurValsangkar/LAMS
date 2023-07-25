package com.project.attendanceleavemanagement.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChangePassword {

    @NotBlank
    private String email;

    @NotBlank
    private String currentPassword;

    @NotBlank
    private String NewPassword;
}
