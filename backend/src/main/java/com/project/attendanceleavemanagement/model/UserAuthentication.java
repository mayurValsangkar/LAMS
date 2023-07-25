package com.project.attendanceleavemanagement.model;

import com.project.attendanceleavemanagement.enums.RoleName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserAuthentication {

    @Id
    private Long user_iD;

    private String username;

    private String password;

    @Enumerated(EnumType.STRING)
    private RoleName role;

}
