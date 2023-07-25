package com.project.attendanceleavemanagement.payload;

import com.project.attendanceleavemanagement.enums.LeaveApplicationStatus;
import com.project.attendanceleavemanagement.enums.LeaveTypeName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LeaveRequest {

    private LocalDate startDate;
    private LocalDate endDate;
    private String specificReason;
    private LeaveTypeName leaveType;
}


