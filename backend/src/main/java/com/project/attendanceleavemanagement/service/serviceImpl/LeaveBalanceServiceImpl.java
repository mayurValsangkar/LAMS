package com.project.attendanceleavemanagement.service.serviceImpl;

import com.project.attendanceleavemanagement.enums.LeaveTypeName;
import com.project.attendanceleavemanagement.model.LeaveBalance;
import com.project.attendanceleavemanagement.model.User;
import com.project.attendanceleavemanagement.payload.LeaveBalanceDTO;
import com.project.attendanceleavemanagement.repository.LeaveBalanceRepository;
import com.project.attendanceleavemanagement.repository.UserRepository;
import com.project.attendanceleavemanagement.service.LeaveBalanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaveBalanceServiceImpl implements LeaveBalanceService {

    @Autowired
    private LeaveBalanceRepository leaveBalanceRepository;


    @Autowired
    private UserRepository userRepository;

    @Override
    public LeaveBalanceDTO getLeaveBalanceByUserId(Long userId) {
        LeaveBalanceDTO leaveBalanceDTO = new LeaveBalanceDTO();

        // Retrieve the leave balances for the user
        List<LeaveBalance> leaveBalances = leaveBalanceRepository.findByUserId(userId);

        // Update the leave balance DTO with the values from the entities
        for (LeaveBalance leaveBalance : leaveBalances) {
            if (leaveBalance.getType().equals(LeaveTypeName.Sick)) {
                leaveBalanceDTO.setSickCount(leaveBalance.getRemainingLeaves());
            } else if (leaveBalance.getType().equals(LeaveTypeName.Casual)) {
                leaveBalanceDTO.setCasualCount(leaveBalance.getRemainingLeaves());
            } else if (leaveBalance.getType().equals(LeaveTypeName.Personal)) {
                leaveBalanceDTO.setPersonalCount(leaveBalance.getRemainingLeaves());
            } else if (leaveBalance.getType().equals(LeaveTypeName.Maternity)) {
                leaveBalanceDTO.setMaternityCount(leaveBalance.getRemainingLeaves());
            } else if (leaveBalance.getType().equals(LeaveTypeName.Paternity)) {
                leaveBalanceDTO.setPaternityCount(leaveBalance.getRemainingLeaves());
            } else if (leaveBalance.getType().equals(LeaveTypeName.Marriage)) {
                leaveBalanceDTO.setMarriageCount(leaveBalance.getRemainingLeaves());
            }
        }

        return leaveBalanceDTO;
    }

    @Override
    public ResponseEntity reset(Long userId, LeaveTypeName type) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));

            LeaveBalance leaveBalance = leaveBalanceRepository.findByUserAndType(user, type);
            if (leaveBalance != null) {
                int defaultBalance = getDefaultLeaveBalance(type); // Get the default leave balance based on the leave type

                leaveBalance.setRemainingLeaves(defaultBalance);
                leaveBalanceRepository.save(leaveBalance);

                return ResponseEntity.ok("Leave balance reset successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Leave balance is already been reset for current employee");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while resetting leave balance");
        }
    }

    private int getDefaultLeaveBalance(LeaveTypeName type) {
        switch (type) {
            case Sick:
            case Casual:
            case Personal:
            case Marriage:
                return 15;
            case Maternity:
                return 180;
            case Paternity:
                return 10;
            default:
                return 0;
        }
    }
}
