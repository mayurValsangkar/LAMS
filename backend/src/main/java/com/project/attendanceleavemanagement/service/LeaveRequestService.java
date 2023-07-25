package com.project.attendanceleavemanagement.service;

import com.project.attendanceleavemanagement.model.LeaveApplication;
import com.project.attendanceleavemanagement.payload.LeaveRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface LeaveRequestService {

    LeaveApplication applyForLeave(LeaveRequest leaveRequest, Long userId);

    List<LeaveApplication> getOneEmployeeLeaveRequests(Long employeeId);

    List<LeaveApplication> getAll();

    void sendEmailsToSupervisors();

    LeaveApplication approveLeaveRequest(Long leaveRequestId);

    LeaveApplication rejectLeaveRequest(Long leaveRequestId);

    List<LeaveApplication> getPendingLeaveRequests();
}
