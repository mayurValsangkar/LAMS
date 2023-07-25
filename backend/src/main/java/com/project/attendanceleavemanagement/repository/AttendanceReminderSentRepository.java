package com.project.attendanceleavemanagement.repository;

import com.project.attendanceleavemanagement.model.AttendanceReminderSent;
import com.project.attendanceleavemanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface AttendanceReminderSentRepository extends JpaRepository<AttendanceReminderSent, Long> {

    boolean existsByUserAndReminderDate(User user, LocalDate reminderDate);
}
