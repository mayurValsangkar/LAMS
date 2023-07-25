package com.project.attendanceleavemanagement.repository;

import com.project.attendanceleavemanagement.enums.AttendanceStatus;
import com.project.attendanceleavemanagement.model.Attendance;
import com.project.attendanceleavemanagement.model.User;
import com.project.attendanceleavemanagement.payload.AttendanceDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByUser(User employee);

    boolean existsByUser(User user);

    boolean existsByUserAndDate(User user, LocalDate attendanceDate);

    List<Attendance> findByStatus(AttendanceStatus pending);
}
