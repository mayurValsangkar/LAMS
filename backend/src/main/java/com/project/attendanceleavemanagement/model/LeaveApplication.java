package com.project.attendanceleavemanagement.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.project.attendanceleavemanagement.enums.LeaveApplicationStatus;
import com.project.attendanceleavemanagement.enums.LeaveTypeName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.time.LocalDate;

@Entity
@Table(name = "leave_request")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LeaveApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "leave_id")
    private Long id;

    @JsonIgnore
    @ManyToOne( fetch = FetchType.EAGER )
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "user_id", insertable = false, updatable = false)
    private Long userId;

    @Column(name = "start_date")
    @NotBlank
    private LocalDate startDate;

    @Column(name = "end_date")
    @NotBlank
    private LocalDate endDate;

    @Column(name = "reason")
    private String specificReason;

    @Enumerated(EnumType.STRING)
    @Column(name = "leave_status")
    private LeaveApplicationStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "leave_type")
    private LeaveTypeName leaveType;
}
