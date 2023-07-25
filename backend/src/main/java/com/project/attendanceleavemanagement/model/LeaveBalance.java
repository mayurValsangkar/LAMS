package com.project.attendanceleavemanagement.model;

import com.project.attendanceleavemanagement.enums.LeaveTypeName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Entity
@Table(name = "leave_balance")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @NotBlank
    private LeaveTypeName type;

    @Column(name = "total_leaves_taken")
    private Integer totalLeaves;

    @Column(name = "remaining_leaves")
    private Integer remainingLeaves;

    @Column(name = "applied_leaves_request")
    private Integer appliedLeaves;

}
