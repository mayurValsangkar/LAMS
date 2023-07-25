package com.project.attendanceleavemanagement.util;

import com.project.attendanceleavemanagement.payload.SignUpRequest;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class EmployeeExcelUtil {

    public static List<SignUpRequest> parseEmployeesFromExcel(MultipartFile file) throws IOException {
        List<SignUpRequest> signUpRequestList = new ArrayList<>();

        Workbook workbook = new XSSFWorkbook(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        for (Row row : sheet) {
            if (row.getRowNum() == 0) {
                continue; // Skip header row
            }

            SignUpRequest signUpRequest = new SignUpRequest();

            signUpRequest.setFirstName(getStringValue(row.getCell(0)));
            signUpRequest.setMiddleName(getStringValue(row.getCell(1)));
            signUpRequest.setLastName(getStringValue(row.getCell(2)));
            signUpRequest.setGender(getStringValue(row.getCell(3)));
            signUpRequest.setEmail(getStringValue(row.getCell(4)));
            signUpRequest.setUsername(getStringValue(row.getCell(5)));
            signUpRequest.setMarriageStatus(getStringValue(row.getCell(6)));
            signUpRequest.setCountry(getStringValue(row.getCell(7)));
            signUpRequest.setPermanentAddress(getStringValue(row.getCell(8)));
            signUpRequest.setContactNumber(getStringValue(row.getCell(9)));
            signUpRequest.setEmergencyContactNumber(getStringValue(row.getCell(10)));


            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

            // Retrieve the cell values and handle numeric and string cells separately
            Cell dobCell = row.getCell(11);
            Cell joinDateCell = row.getCell(12);

            LocalDate dob;
            LocalDate joinDate;

            if (dobCell.getCellType() == CellType.STRING) {
                String dobString = dobCell.getStringCellValue();
                dob = LocalDate.parse(dobString, dateFormatter);
            } else if (dobCell.getCellType() == CellType.NUMERIC) {
                LocalDate dobDateTime = dobCell.getLocalDateTimeCellValue().toLocalDate();
                dob = LocalDate.of(dobDateTime.getYear(), dobDateTime.getMonthValue(), dobDateTime.getDayOfMonth());
            } else {
                // Handle the case when the cell type is neither string nor numeric
                throw new IllegalStateException("Invalid cell type for DOB");
            }

            if (joinDateCell.getCellType() == CellType.STRING) {
                String joinDateString = joinDateCell.getStringCellValue();
                joinDate = LocalDate.parse(joinDateString, dateFormatter);
            } else if (joinDateCell.getCellType() == CellType.NUMERIC) {
                LocalDate joinDateTime = joinDateCell.getLocalDateTimeCellValue().toLocalDate();
                joinDate = LocalDate.of(joinDateTime.getYear(), joinDateTime.getMonthValue(), joinDateTime.getDayOfMonth());
            } else {
                // Handle the case when the cell type is neither string nor numeric
                throw new IllegalStateException("Invalid cell type for join date");
            }

            // Set the parsed dates in the signUpRequest object
            signUpRequest.setDob(dob);
            signUpRequest.setJoinDate(joinDate);

            signUpRequest.setStatus(getStringValue(row.getCell(13)));
            signUpRequest.setDesignation(getStringValue(row.getCell(14)));
            signUpRequest.setJobTitle(getStringValue(row.getCell(15)));
            signUpRequest.setEmployeeType(getStringValue(row.getCell(16)));
            signUpRequest.setRosterType(getStringValue(row.getCell(17)));

            signUpRequest.setDepartment((long) row.getCell(18).getNumericCellValue());
            signUpRequest.setManager((long) row.getCell(19).getNumericCellValue());

            signUpRequest.setRole(getStringValue(row.getCell(20)));

            signUpRequestList.add(signUpRequest);
        }

        workbook.close();

        return signUpRequestList;
    }

    private static String getStringValue(Cell cell) {
        if (cell == null) {
            return ""; // Handle empty cells
        }
        if (cell.getCellType() == CellType.STRING) {
            return cell.getStringCellValue();
        } else if (cell.getCellType() == CellType.NUMERIC) {
            return String.valueOf((long) cell.getNumericCellValue());
        } else {
            return ""; // Handle other cell types if needed
        }
    }
}