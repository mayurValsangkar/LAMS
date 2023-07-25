package com.project.attendanceleavemanagement.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.project.attendanceleavemanagement.enums.RoleName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.time.LocalDate;


@Entity
@Table(name = "user",  uniqueConstraints = {
        @UniqueConstraint(columnNames = {
                "email"
        }),
        @UniqueConstraint(columnNames = {
                "username"
        })
})
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "first_name")
    @NotBlank
    private String firstName;

    @Column(name = "middle_name")
    private String middleName;

    @Column(name = "last_name")
    @NotBlank
    private String lastName;

    @NotBlank
    private String gender;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String username;

    private String password;

    @NotBlank
    @Column(name = "marriage_status")
    private String marriageStatus;

    @NotBlank
    private String country;

    @NotBlank
    @Column(name = "permanent_address")
    private String permanentAddress;

    @NotBlank
    @Column(name = "contact_number")
    private String contactNumber;

    @NotBlank
    @Column(name = "emergency_contact_number")
    private String emergencyContactNumber;

    @NotBlank
    private LocalDate dob;

    @Column(name = "join_date")
    @NotBlank
    private LocalDate joinDate;

    @Column(name = "current_status")
    @NotBlank
    private String status;

    @NotBlank
    private String designation;

    @NotBlank
    @Column(name = "job_title")
    private String jobTitle;

    @NotBlank
    @Column(name = "employee_type")
    private String employeeType;

    @NotBlank
    @Column(name = "roster_type")
    private String rosterType;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id")
    private Department department;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "manager_id")
    private User manager;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    @NotBlank
    private RoleName role;


    public User(String firstName, String middleName, String lastName, String gender, String email, String username, String password, String marriageStatus, String country, String permanentAddress, String contactNumber, String emergencyContactNumber, LocalDate dob, LocalDate joinDate, String status, String designation, String jobTitle, String employeeType, String rosterType, Department department, User manager, RoleName role) {
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.gender = gender;
        this.email = email;
        this.username = username;
        this.password = password;
        this.marriageStatus = marriageStatus;
        this.country = country;
        this.permanentAddress = permanentAddress;
        this.contactNumber = contactNumber;
        this.emergencyContactNumber = emergencyContactNumber;
        this.dob = dob;
        this.joinDate = joinDate;
        this.status = status;
        this.designation = designation;
        this.jobTitle = jobTitle;
        this.employeeType = employeeType;
        this.rosterType = rosterType;
        this.department = department;
        this.manager = manager;
        this.role = role;
    }
}
