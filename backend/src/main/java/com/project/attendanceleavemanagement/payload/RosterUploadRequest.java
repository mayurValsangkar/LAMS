package com.project.attendanceleavemanagement.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RosterUploadRequest {

    private List<Long> employeeIds;
    private List<LocalDate> wfoDates;
}
