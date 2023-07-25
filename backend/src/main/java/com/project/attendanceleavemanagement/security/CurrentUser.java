package com.project.attendanceleavemanagement.security;

import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.lang.annotation.*;


// Annotated parameter should be resolved to the currently authenticated user principal.
// It provides a convenient way to access the authenticated user information within this Spring Security-enabled application.

@Target({ElementType.PARAMETER, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@AuthenticationPrincipal
public @interface CurrentUser {

}
