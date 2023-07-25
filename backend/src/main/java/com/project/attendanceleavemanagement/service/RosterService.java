package com.project.attendanceleavemanagement.service;

import com.project.attendanceleavemanagement.model.User;
import com.project.attendanceleavemanagement.payload.Employee;
import com.project.attendanceleavemanagement.payload.RosterDTO;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;

public interface RosterService {

    void generateCustomHybridRosterForEmployees(List<Long> employeeIds, List<LocalDate> wfoDates);

    List<RosterDTO> getRoster(Long id);

    List<User> findHybridEmployee();
}
