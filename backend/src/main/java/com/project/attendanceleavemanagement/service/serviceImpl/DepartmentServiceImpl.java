package com.project.attendanceleavemanagement.service.serviceImpl;

import com.project.attendanceleavemanagement.model.Department;
import com.project.attendanceleavemanagement.repository.DepartmentRepository;
import com.project.attendanceleavemanagement.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Override
    public Department add(Department department) {
        return departmentRepository.save(department);
    }

    @Override
    public List<Department> findAll(){
        List<Department> departmentList = (List<Department>) this.departmentRepository.findAll();
        return departmentList;
    }

}
