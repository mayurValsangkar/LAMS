package com.project.attendanceleavemanagement.controller;

import com.project.attendanceleavemanagement.model.LeaveApplication;
import com.project.attendanceleavemanagement.payload.LeaveRequest;
import com.project.attendanceleavemanagement.security.JwtTokenProvider;
import com.project.attendanceleavemanagement.service.LeaveRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leave")
public class LeaveRequestController {


    @Autowired
    private LeaveRequestService leaveRequestService;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtTokenProvider tokenProvider;

    @PostMapping(value = "/request")
    public ResponseEntity addRequest(@RequestHeader("Authorization") String token, @RequestBody LeaveRequest leaveRequest) {
        if(StringUtils.hasText(token) && token.startsWith("Bearer ")) {
            String jwt = token.substring(7);
            Long userId = tokenProvider.getUserIdFromJWT(jwt);
            LeaveApplication leaveApplication =  leaveRequestService.applyForLeave(leaveRequest, userId);
            return ResponseEntity.ok().body(leaveApplication);
        }
        else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Service Denied");
        }
    }


    @GetMapping("/all")
    public List<LeaveApplication> getAll() {
        return leaveRequestService.getAll();
    }


    @GetMapping("/find/{id}")
    public List<LeaveApplication> getOneEmployeeLeaveRequests(@PathVariable("id") Long employeeId) {
        return leaveRequestService.getOneEmployeeLeaveRequests(employeeId);

    }


    @PutMapping("/request/{leaveRequestId}/approve")
    public ResponseEntity approveLeaveRequest(@PathVariable("leaveRequestId") Long leaveRequestId) {
        try {
            LeaveApplication leaveRequest = leaveRequestService.approveLeaveRequest(leaveRequestId);
            return ResponseEntity.ok(leaveRequest);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


    @PutMapping("/request/{leaveRequestId}/reject")
    public ResponseEntity rejectLeaveRequest(@PathVariable("leaveRequestId") Long leaveRequestId) {
        try {
            LeaveApplication leaveRequest = leaveRequestService.rejectLeaveRequest(leaveRequestId);
            return ResponseEntity.ok(leaveRequest);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/pending")
    public List<LeaveApplication> getPendingLeaveRequests() {
        return leaveRequestService.getPendingLeaveRequests();
    }
}
