package com.project.attendanceleavemanagement.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.time.LocalDate;

@Entity
@Table(name = "holiday_calendar")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class HolidayCalendar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "holiday_calendar_id")
    private Long id;

    @Column(name = "holiday_date")
    @NotBlank
    private LocalDate holidayDate;

    @Column(name = "holiday_desc")
    @NotBlank
    private String holidayDescription;
}
