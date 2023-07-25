package com.project.attendanceleavemanagement.repository;

import com.project.attendanceleavemanagement.model.Department;
import com.project.attendanceleavemanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsernameOrEmail(String username, String email);

    User findByUsername(String username);

    Boolean existsByEmail(String email);

    User getOne(Long id);

    List<User> findByStatus(String status);

    List<User> findByDepartment(Department department);

    User findByEmail(String email);

    List<User> findByEmployeeType(String hybrid);

    User findByIdAndEmployeeType(Long employeeId, String hybrid);

    List<User> findByIdInAndEmployeeType(List<Long> employeeIds, String hybrid);
}
