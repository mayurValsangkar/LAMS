package com.project.attendanceleavemanagement.service;

import com.project.attendanceleavemanagement.enums.LeaveTypeName;
import com.project.attendanceleavemanagement.model.LeaveBalance;
import com.project.attendanceleavemanagement.payload.LeaveBalanceDTO;
import org.springframework.http.ResponseEntity;

public interface LeaveBalanceService {

    LeaveBalanceDTO getLeaveBalanceByUserId(Long userId);

    ResponseEntity reset(Long userId, LeaveTypeName type);
}
