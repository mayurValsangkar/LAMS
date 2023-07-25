package com.project.attendanceleavemanagement.security;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JwtAuthenticationResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private Boolean success = true;
    private String role;

    public JwtAuthenticationResponse(Boolean status, String accessToken, String role) {
        this.success = status;
        this.accessToken = accessToken;
        this.role = role;

    }

    public JwtAuthenticationResponse(Boolean status, String accessToken) {
        this.success = status;
        this.accessToken = accessToken;

    }
}
