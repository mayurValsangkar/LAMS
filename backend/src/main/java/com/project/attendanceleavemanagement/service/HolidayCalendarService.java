package com.project.attendanceleavemanagement.service;

import com.project.attendanceleavemanagement.model.HolidayCalendar;
import com.project.attendanceleavemanagement.payload.PublicHoliday;

import java.io.InputStream;
import java.util.List;

public interface HolidayCalendarService {

    HolidayCalendar addHoliday(PublicHoliday publicHoliday);

    List<HolidayCalendar> getAllPublicHolidayList();

    List<HolidayCalendar> addHolidaysFromExcel(InputStream inputStream);

    void deleteHoliday(Long holidayId);
}
