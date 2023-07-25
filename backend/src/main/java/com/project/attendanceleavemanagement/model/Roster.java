package com.project.attendanceleavemanagement.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.time.LocalDate;

@Entity
@Table(name = "roster")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Roster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "roaster_date")
    @NotBlank
    private LocalDate date;

    @Column(name = "roaster_type")
    @NotBlank
    private String type;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private User user;
}
