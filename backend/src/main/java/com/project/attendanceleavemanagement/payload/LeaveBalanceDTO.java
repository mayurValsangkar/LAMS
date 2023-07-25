package com.project.attendanceleavemanagement.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
public class LeaveBalanceDTO {

    private Integer sickCount;
    private Integer casualCount;
    private Integer personalCount;
    private Integer maternityCount;
    private Integer paternityCount;
    private Integer marriageCount;
    private Integer compOffCount;


    // Set default values for leave types
    public LeaveBalanceDTO() {
        this.sickCount = 15;
        this.casualCount = 15;
        this.personalCount = 15;
        this.maternityCount = 180;
        this.paternityCount = 10;
        this.marriageCount = 15;
        this.compOffCount = null;
    }


}
