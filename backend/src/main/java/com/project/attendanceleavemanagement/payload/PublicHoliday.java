package com.project.attendanceleavemanagement.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PublicHoliday {

    private LocalDate holidayDate;
    private String holidayDescription;
}
