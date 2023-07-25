package com.project.attendanceleavemanagement.service.serviceImpl;

import com.project.attendanceleavemanagement.model.HolidayCalendar;
import com.project.attendanceleavemanagement.payload.PublicHoliday;
import com.project.attendanceleavemanagement.repository.HolidayCalenderRepository;
import com.project.attendanceleavemanagement.service.HolidayCalendarService;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class HolidayCalendarServiceImpl implements HolidayCalendarService {

    @Autowired
    private HolidayCalenderRepository holidayCalendarRepository;

    @Override
    public HolidayCalendar addHoliday(PublicHoliday publicHoliday) {
        HolidayCalendar holidayCalendar = new HolidayCalendar();
        holidayCalendar.setHolidayDate(publicHoliday.getHolidayDate());
        holidayCalendar.setHolidayDescription(publicHoliday.getHolidayDescription());
        return holidayCalendarRepository.save(holidayCalendar);
    }

    @Override
    public List<HolidayCalendar> getAllPublicHolidayList() {
        List<HolidayCalendar> holidayCalendarList = holidayCalendarRepository.findAll();
        return holidayCalendarList;
    }

    @Override
    public List<HolidayCalendar> addHolidaysFromExcel(InputStream inputStream) {
        List<HolidayCalendar> holidayCalendarList = new ArrayList<>();

        try (Workbook workbook = WorkbookFactory.create(inputStream)) {
            Sheet sheet = workbook.getSheetAt(0); // Assuming the holidays are in the first sheet

            for (Row row : sheet) {
                if (row.getRowNum() == 0) {
                    continue; // Skip the header row
                }

                DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

                Cell dateCell = row.getCell(0);
                Cell descriptionCell = row.getCell(1);

                // Check cell types and retrieve cell values accordingly
                LocalDate date;
                String description;

                if (dateCell.getCellType() == CellType.STRING) {
                    String dateString = dateCell.getStringCellValue();
                    date = LocalDate.parse(dateString, dateFormatter);
                } else if (dateCell.getCellType() == CellType.NUMERIC) {
                    LocalDate dateTime = dateCell.getLocalDateTimeCellValue().toLocalDate();
                    date = LocalDate.of(dateTime.getYear(), dateTime.getMonthValue(), dateTime.getDayOfMonth());
                } else {
                    // Handle the case when the cell type is neither string nor numeric
                    throw new IllegalStateException("Invalid cell type for holiday date");
                }

                if (descriptionCell.getCellType() == CellType.STRING) {
                    description = descriptionCell.getStringCellValue();
                } else {
                    throw new IllegalArgumentException("Invalid description format");
                }

                // Create the HolidayCalendar object
                HolidayCalendar holidayCalendar = new HolidayCalendar();
                holidayCalendar.setHolidayDate(date);
                holidayCalendar.setHolidayDescription(description);

                // Add the holiday to the list
                holidayCalendarList.add(holidayCalendar);
            }

            // Save the list of holidays to the database
            holidayCalendarList = holidayCalendarRepository.saveAll(holidayCalendarList);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return holidayCalendarList;
    }

    @Override
    public void deleteHoliday(Long holidayId) {
        // Check if the holiday exists
        HolidayCalendar holiday = holidayCalendarRepository.findById(holidayId)
                .orElseThrow(() -> new IllegalArgumentException("Holiday not found"));

        // Delete the holiday
        holidayCalendarRepository.delete(holiday);
    }
}
