package com.project.attendanceleavemanagement.repository;

import com.project.attendanceleavemanagement.model.Roster;
import com.project.attendanceleavemanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RosterRepository extends JpaRepository<Roster,Long> {

    List<Roster> findByUser(User employee);

    Roster findByDateAndUser(LocalDate date, User user);
}
