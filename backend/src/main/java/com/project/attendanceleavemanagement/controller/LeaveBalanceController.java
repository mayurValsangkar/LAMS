package com.project.attendanceleavemanagement.controller;

import com.project.attendanceleavemanagement.enums.LeaveTypeName;
import com.project.attendanceleavemanagement.payload.LeaveBalanceDTO;
import com.project.attendanceleavemanagement.service.LeaveBalanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/balance")
public class LeaveBalanceController {


    @Autowired
    private LeaveBalanceService leaveBalanceService;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getCurrentUserLeaveBalance(@PathVariable Long userId) {
        LeaveBalanceDTO leaveBalance = leaveBalanceService.getLeaveBalanceByUserId(userId);
        if (leaveBalance != null) {
            return ResponseEntity.ok().body(leaveBalance);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Leave balance not found for the current user.");
        }
    }


    @PostMapping("/reset/{userId}/{type}")
    public ResponseEntity resetBalance(@PathVariable("userId") Long userId, @PathVariable("type") String type){
        LeaveTypeName leaveTypeName = null;

        // Convert the string type to the corresponding LeaveTypeName enum value
        try {
            leaveTypeName = LeaveTypeName.valueOf(type);
        } catch (IllegalArgumentException e) {
            // Handle the case when the provided type doesn't match any enum constant
            return ResponseEntity.badRequest().body("Invalid leave type: " + type);
        } catch (NullPointerException e) {
            // Handle the case when the 'type' parameter is null or empty
            return ResponseEntity.badRequest().body("Leave type cannot be empty or null.");
        }

        // Now you have the leaveTypeName enum value, proceed with the reset
        // Call the reset method in LeaveBalanceService and return the result
        return leaveBalanceService.reset(userId, leaveTypeName);
    }

}
