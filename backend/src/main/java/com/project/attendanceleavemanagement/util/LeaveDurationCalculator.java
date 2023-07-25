package com.project.attendanceleavemanagement.util;

import com.project.attendanceleavemanagement.repository.HolidayCalenderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class LeaveDurationCalculator {

    @Autowired
    private HolidayCalenderRepository holidayCalendarRepository;

    public int calculateLeaveDuration(LocalDate startDate, LocalDate endDate) {
        int duration = 0;
        LocalDate currentDate = startDate;

        while (!currentDate.isAfter(endDate)) {
            // Exclude Saturdays, Sundays, and holidays
            if (currentDate.getDayOfWeek() != DayOfWeek.SATURDAY
                    && currentDate.getDayOfWeek() != DayOfWeek.SUNDAY
                    && !isHoliday(currentDate)) {
                duration++;
            }
            currentDate = currentDate.plusDays(1);
        }

        return duration;
    }

    private boolean isHoliday(LocalDate date) {
        return holidayCalendarRepository.existsByHolidayDate(date);
    }
}
