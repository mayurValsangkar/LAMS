package com.project.attendanceleavemanagement.controller;

import com.project.attendanceleavemanagement.model.HolidayCalendar;
import com.project.attendanceleavemanagement.payload.PublicHoliday;
import com.project.attendanceleavemanagement.service.HolidayCalendarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/holiday")
public class HolidayCalendarController {

    @Autowired
    private HolidayCalendarService holidayCalendarService;


    @PostMapping("/add")
    public ResponseEntity addHoliday(@RequestBody PublicHoliday publicHoliday) {
        try {
            HolidayCalendar savedHoliday = holidayCalendarService.addHoliday(publicHoliday);
            return ResponseEntity.ok(savedHoliday);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to add holiday: " + e.getMessage());
        }
    }


    @PostMapping("/add-bulk")
    public ResponseEntity addBulkHolidays(@RequestParam("file") MultipartFile file) {
        try {
            List<HolidayCalendar> addedHolidays = holidayCalendarService.addHolidaysFromExcel(file.getInputStream());
            return ResponseEntity.ok(addedHolidays);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Failed to add bulk holidays: " + e.getMessage());
        }
    }


    @GetMapping("/all")
    public ResponseEntity doListAll(){
        try{
            List<HolidayCalendar> holidayCalendarList = holidayCalendarService.getAllPublicHolidayList();
            return ResponseEntity.ok(holidayCalendarList);
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Failed to fetch public holidays: " + e.getMessage());
        }
    }

    @DeleteMapping("/{holidayId}")
    public ResponseEntity deleteHoliday(@PathVariable Long holidayId) {
        try {
            holidayCalendarService.deleteHoliday(holidayId);
            return ResponseEntity.ok().body("Holiday deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete holiday: " + e.getMessage());
        }
    }
}
