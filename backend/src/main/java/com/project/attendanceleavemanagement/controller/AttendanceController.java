package com.project.attendanceleavemanagement.controller;

import com.project.attendanceleavemanagement.model.Attendance;
import com.project.attendanceleavemanagement.payload.AttendanceDTO;
import com.project.attendanceleavemanagement.payload.LeaveRequest;
import com.project.attendanceleavemanagement.security.JwtTokenProvider;
import com.project.attendanceleavemanagement.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtTokenProvider tokenProvider;

    @PostMapping("/mark")
    public ResponseEntity markAttendance(@RequestHeader("Authorization") String token, @RequestBody AttendanceDTO attendance) {

        if (StringUtils.hasText(token) && token.startsWith("Bearer ")) {
            String jwt = token.substring(7);
            Long userId = tokenProvider.getUserIdFromJWT(jwt);
            Attendance markedAttendance = attendanceService.markAttendance(attendance, userId);
            return ResponseEntity.ok().body(markedAttendance);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Service Denied");
        }
    }


    @PostMapping("/multiple")
    public ResponseEntity markAttendance(@RequestHeader("Authorization") String token, @RequestBody List<AttendanceDTO> attendanceList) {
        if (StringUtils.hasText(token) && token.startsWith("Bearer ")) {
            String jwt = token.substring(7);
            Long userId = tokenProvider.getUserIdFromJWT(jwt);
            List<Attendance> markedAttendanceList = attendanceService.markMultipleAttendance(attendanceList, userId);
            return ResponseEntity.ok().body(markedAttendanceList);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Service Denied");
        }
    }


    @GetMapping("/all")
    public List<Attendance> getAll(){
        return attendanceService.getAll();
    }


    @GetMapping("/find/{id}")
    public List<Attendance> getOneAttendanceRequests(@PathVariable("id") Long employeeId) {
        return attendanceService.getOneEmployeeAttendance(employeeId);

    }



    @PutMapping("/{attendanceId}/confirm")
    public ResponseEntity confirmAttendance(@PathVariable("attendanceId") Long attendanceId) {
        try {
            Attendance attendance = attendanceService.confirmAttendance(attendanceId);
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


    @PutMapping("/{attendanceId}/reject")
    public ResponseEntity rejectAttendance(@PathVariable("attendanceId") Long attendanceId) {
        try {
            Attendance attendance = attendanceService.rejectAttendance(attendanceId);
            return ResponseEntity.ok(attendance);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }



    @GetMapping("/report/{month}/{year}")
    public ResponseEntity<Resource> downloadAttendanceReport(@PathVariable("month") int month, @PathVariable("year") int year) {
        // Generate the attendance report for the specified month and year
        byte[] reportBytes = attendanceService.generateAttendanceReportForMonthAndYear(month, year);

        // Create a resource from the report bytes
        ByteArrayResource resource = new ByteArrayResource(reportBytes);

        // Set the response headers
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=Attendance_Report_" + month + "_" + year + ".xlsx");

        // Return the ResponseEntity with the resource and headers
        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }


    @GetMapping("/pending")
    public List<Attendance> getPendingAttendanceRequests() {
        return attendanceService.getPendingAttendanceRequests();
    }
}
