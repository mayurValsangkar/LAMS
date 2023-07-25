package com.project.attendanceleavemanagement.repository;

import com.project.attendanceleavemanagement.enums.LeaveTypeName;
import com.project.attendanceleavemanagement.model.LeaveBalance;
import com.project.attendanceleavemanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance, Long> {

    LeaveBalance findByUserAndType(User user, LeaveTypeName leaveType);

    List<LeaveBalance> findByUserId(Long userId);
}
