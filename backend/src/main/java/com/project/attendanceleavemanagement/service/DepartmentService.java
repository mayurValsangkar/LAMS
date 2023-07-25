package com.project.attendanceleavemanagement.service;

import com.project.attendanceleavemanagement.model.Department;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface DepartmentService {

    Department add(Department department);

    List<Department> findAll();
}
