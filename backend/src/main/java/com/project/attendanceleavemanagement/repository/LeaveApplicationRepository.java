package com.project.attendanceleavemanagement.repository;

import com.project.attendanceleavemanagement.enums.LeaveApplicationStatus;
import com.project.attendanceleavemanagement.model.LeaveApplication;
import com.project.attendanceleavemanagement.model.User;
import com.project.attendanceleavemanagement.payload.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveApplicationRepository extends JpaRepository<LeaveApplication, Long> {

    List<LeaveApplication> findByUser(User employee);

    boolean existsByUserAndStatus(User user, LeaveApplicationStatus PENDING);

    List<LeaveApplication> findByStatus(LeaveApplicationStatus PENDING);

}
