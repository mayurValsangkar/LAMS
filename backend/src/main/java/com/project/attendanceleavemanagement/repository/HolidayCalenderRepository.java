package com.project.attendanceleavemanagement.repository;

import com.project.attendanceleavemanagement.model.HolidayCalendar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;


@Repository
public interface HolidayCalenderRepository extends JpaRepository<HolidayCalendar, Long> {

    boolean existsByHolidayDate(LocalDate date);
}
