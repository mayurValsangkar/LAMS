package com.project.attendanceleavemanagement.service.serviceImpl;

import com.project.attendanceleavemanagement.enums.AttendanceStatus;
import com.project.attendanceleavemanagement.model.Attendance;
import com.project.attendanceleavemanagement.model.AttendanceReminderSent;
import com.project.attendanceleavemanagement.model.User;
import com.project.attendanceleavemanagement.payload.AttendanceDTO;
import com.project.attendanceleavemanagement.repository.AttendanceReminderSentRepository;
import com.project.attendanceleavemanagement.repository.AttendanceRepository;
import com.project.attendanceleavemanagement.repository.HolidayCalenderRepository;
import com.project.attendanceleavemanagement.repository.UserRepository;
import com.project.attendanceleavemanagement.service.AttendanceService;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AttendanceServiceImpl implements AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HolidayCalenderRepository holidayCalendarRepository;

    @Autowired
    private EmailService emailService;


    @Autowired
    private AttendanceReminderSentRepository attendanceReminderSentRepository;

    @Override
    public Attendance markAttendance(AttendanceDTO attendanceDTO, Long userId) {

        // Check if there is a holiday on the given date
        LocalDate attendanceDate = attendanceDTO.getDate();
        boolean isHoliday = holidayCalendarRepository.existsByHolidayDate(attendanceDate);

        if (isHoliday) {
            throw new IllegalArgumentException("Attendance cannot be marked on a holiday");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));


        User manager = user.getManager();

        // Check if attendance is already marked for the given user and date
        boolean attendanceExists = attendanceRepository.existsByUserAndDate(user, attendanceDate);

        if (attendanceExists) {
            throw new IllegalArgumentException("Attendance is already marked for the user on the given date");
        }

        // Create the attendance entity
        Attendance attendance = new Attendance();
        attendance.setDate(attendanceDTO.getDate());
        attendance.setTime(attendanceDTO.getTime());
        attendance.setType(attendanceDTO.getType());
        attendance.setUser(user);
        attendance.setStatus(AttendanceStatus.PENDING); // AttendanceStatus is an enum

        // Save the attendance
        attendance = attendanceRepository.save(attendance);

        // Send email to the manager
        emailService.sendAttendanceNotification(manager.getEmail(), attendance);

        return attendance;
    }


    @Override
    public List<Attendance> markMultipleAttendance(List<AttendanceDTO> attendanceDTOList, Long userId) {
        List<Attendance> markedAttendanceList = new ArrayList<>();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));

        User manager = user.getManager();

        for (AttendanceDTO attendanceDTO : attendanceDTOList) {
            // Check if there is a holiday on the given date
            LocalDate attendanceDate = attendanceDTO.getDate();
            boolean isHoliday = holidayCalendarRepository.existsByHolidayDate(attendanceDate);

            if (isHoliday) {
                throw new IllegalArgumentException("Attendance cannot be marked on a holiday");
            }

            boolean attendanceExists = attendanceRepository.existsByUserAndDate(user, attendanceDate);

            if (attendanceExists) {
                throw new IllegalArgumentException("Attendance is already marked for the user on the given date");
            }


            // Create the attendance entity
            Attendance attendance = new Attendance();
            attendance.setDate(attendanceDTO.getDate());
            attendance.setTime(attendanceDTO.getTime());
            attendance.setType(attendanceDTO.getType());
            attendance.setUser(user);
            attendance.setStatus(AttendanceStatus.PENDING); // AttendanceStatus is an enum

            // Save the attendance
            attendance = attendanceRepository.save(attendance);
            markedAttendanceList.add(attendance);

        }

        // Send email to the manager
        emailService.sendMultipleAttendanceNotification(manager.getEmail(), markedAttendanceList);

        return markedAttendanceList;
    }


    public Attendance confirmAttendance(Long attendanceId) {
        Attendance attendance = getAttendanceById(attendanceId);
        attendance.setStatus(AttendanceStatus.CONFIRMED);

        // Send email notification to the employee
        User employee = attendance.getUser();
        String employeeEmail = employee.getEmail();
        emailService.sendAttendanceApprovedNotification(employeeEmail, attendance);

        return attendanceRepository.save(attendance);
    }

    public Attendance rejectAttendance(Long attendanceId) {
        Attendance attendance = getAttendanceById(attendanceId);
        attendance.setStatus(AttendanceStatus.REJECTED);

        // Send email notification to the employee
        User employee = attendance.getUser();
        String employeeEmail = employee.getEmail();
        emailService.sendAttendanceRejectedNotification(employeeEmail, attendance);

        return attendanceRepository.save(attendance);
    }

    @Override
    public List<Attendance> getAll() {
        List<Attendance> attendanceList = new ArrayList<>();
        try {
            attendanceList = attendanceRepository.findAll();
            Collections.sort(attendanceList, Comparator.comparingLong(Attendance::getId).reversed());
        } catch (Exception e) {
            e.printStackTrace();
        }

        return attendanceList;
    }

    @Override
    public List<Attendance> getOneEmployeeAttendance(Long employeeId) {
        List<Attendance> attendance = new ArrayList<>();

        try {
            User employee = userRepository.getOne(employeeId);
            attendance = attendanceRepository.findByUser(employee);
            Collections.sort(attendance, Comparator.comparingLong(Attendance::getId).reversed());
        } catch (Exception e) {
            e.printStackTrace();
        }

        return attendance;
    }

    private Attendance getAttendanceById(Long attendanceId) {
        Optional<Attendance> optionalAttendance = attendanceRepository.findById(attendanceId);
        if (optionalAttendance.isEmpty()) {
            throw new IllegalArgumentException("Attendance not found");
        }
        return optionalAttendance.get();
    }


    @PostConstruct
    @Scheduled(cron = "0 0 11 * * MON-FRI") // Runs every weekday at 11:00 AM
    public void sendAttendanceReminderEmail() {
        System.out.println("\n\n\nRun the schedule--------------------------\n\n\n");
        LocalDate yesterday = LocalDate.now().minusDays(1);
        try {
            List<User> workingEmployees = userRepository.findByStatus("Working");

            for (User user : workingEmployees) {
                if (!attendanceRepository.existsByUserAndDate(user, yesterday)) {
                    if (!attendanceReminderSentRepository.existsByUserAndReminderDate(user, yesterday)) {
                        emailService.attendanceReminder(user, yesterday);
                        attendanceReminderSentRepository.save(new AttendanceReminderSent(user, yesterday));
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    public byte[] generateAttendanceReportForMonthAndYear(int month, int year) {
        List<Attendance> attendanceList = attendanceRepository.findAll();

        List<Attendance> filteredAttendance = attendanceList.stream()
                .filter(attendance -> attendance.getDate().getMonthValue() == month && attendance.getDate().getYear() == year)
                .collect(Collectors.toList());

        // Create a new workbook
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Attendance Report");

        // Create header row
        Row headerRow = sheet.createRow(0);
        headerRow.createCell(0).setCellValue("Employee Name");
        headerRow.createCell(1).setCellValue("Attendance Date");
        headerRow.createCell(2).setCellValue("Attendance Time");
        headerRow.createCell(3).setCellValue("Attendance Type");
        headerRow.createCell(4).setCellValue("Attendance Status");

        // Create data rows
        int rowNum = 1;
        for (Attendance attendance : filteredAttendance) {
            Row dataRow = sheet.createRow(rowNum++);
            String fullName = attendance.getUser().getFirstName() + " " + attendance.getUser().getLastName();
            dataRow.createCell(0).setCellValue(fullName);
            dataRow.createCell(1).setCellValue(attendance.getDate().toString());
            dataRow.createCell(2).setCellValue(attendance.getTime().toString());
            dataRow.createCell(3).setCellValue(attendance.getType().toString());
            dataRow.createCell(4).setCellValue(attendance.getStatus().toString());
        }

        // Auto-size columns
        for (int i = 0; i < 5; i++) {
            sheet.autoSizeColumn(i);
        }

        // Write the workbook to a ByteArrayOutputStream
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            workbook.write(outputStream);
            return outputStream.toByteArray();
        } catch (IOException e) {
            e.printStackTrace();
            // Handle the exception appropriately
        }

        return null;
    }

    @Override
    public List<Attendance> getPendingAttendanceRequests() {
        return attendanceRepository.findByStatus(AttendanceStatus.PENDING);
    }
}
