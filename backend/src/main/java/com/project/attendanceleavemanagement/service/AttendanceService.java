package com.project.attendanceleavemanagement.service;

import com.project.attendanceleavemanagement.model.Attendance;
import com.project.attendanceleavemanagement.payload.AttendanceDTO;
import com.project.attendanceleavemanagement.payload.LeaveRequest;
import org.springframework.core.io.Resource;

import java.util.List;

public interface AttendanceService {

    Attendance markAttendance(AttendanceDTO attendance, Long userId);

    Attendance confirmAttendance(Long id);

    Attendance rejectAttendance(Long id);

    List<Attendance> getAll();

    List<Attendance> getOneEmployeeAttendance(Long employeeId);

    void sendAttendanceReminderEmail();

    byte[] generateAttendanceReportForMonthAndYear(int year, int month);

    List<Attendance> markMultipleAttendance(List<AttendanceDTO> attendanceDTOList, Long userId);

    List<Attendance> getPendingAttendanceRequests();
}
