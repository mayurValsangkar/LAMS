package com.project.attendanceleavemanagement.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
public class AttendanceReminderSent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    private LocalDate reminderDate;

    public AttendanceReminderSent(User user, LocalDate reminderDate) {
        this.user = user;
        this.reminderDate = reminderDate;
    }

}
