package com.project.attendanceleavemanagement.service;

import com.project.attendanceleavemanagement.payload.ChangePassword;
import com.project.attendanceleavemanagement.payload.SignUpRequest;
import com.project.attendanceleavemanagement.payload.UpdateUser;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface UserService {

    ResponseEntity<?> searchById(Long id);

    ResponseEntity<?> getAll();

    ResponseEntity<?> updateEmployee(Long id, UpdateUser employee);

    ResponseEntity<?> addEmployee(SignUpRequest signUpRequest);

    ResponseEntity<?> addBulkEmployees(List<SignUpRequest> employees);

    ResponseEntity<?> changePassword(String token, ChangePassword passwords);

    ResponseEntity changeStatus(Long id);

    ResponseEntity<?> searchProfileById(Long id);

    ResponseEntity getManagers();
}
