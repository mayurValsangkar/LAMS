package com.project.attendanceleavemanagement.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileDTO {

    private Long id;
    private String firstName;
    private String middleName;
    private String lastName;
    private String gender;
    private String email;
    private String username;
    private String marriageStatus;
    private String country;
    private String permanentAddress;
    private String contactNumber;
    private String emergencyContactNumber;
    private LocalDate dob;
    private LocalDate joinDate;
    private String status;
    private String designation;
    private String jobTitle;
    private String employeeType;
    private String rosterType;
    private Long department;
    private Long manager;
    private String role;
}
