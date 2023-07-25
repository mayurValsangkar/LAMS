package com.project.attendanceleavemanagement.service.serviceImpl;

import com.project.attendanceleavemanagement.model.Roster;
import com.project.attendanceleavemanagement.model.User;
import com.project.attendanceleavemanagement.payload.Employee;
import com.project.attendanceleavemanagement.payload.RosterDTO;
import com.project.attendanceleavemanagement.repository.HolidayCalenderRepository;
import com.project.attendanceleavemanagement.repository.RosterRepository;
import com.project.attendanceleavemanagement.repository.UserRepository;
import com.project.attendanceleavemanagement.service.RosterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

//@Scope("prototype")  // Any number of object instance
@Service  // by default scope is singleton
public class RosterServiceImpl implements RosterService {


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RosterRepository rosterRepository;

    @Autowired
    private HolidayCalenderRepository holidayCalendarRepository;

    public void generateCustomHybridRosterForEmployees(List<Long> employeeIds, List<LocalDate> wfoDates) {
        // Fetch all hybrid employees based on the provided employee IDs
        List<User> hybridEmployees = userRepository.findByIdInAndEmployeeType(employeeIds, "Hybrid");

        // Iterate over each hybrid employee and generate the roster
        for (User employee : hybridEmployees) {
            // Fetch the current roster entries for the employee, if any
            List<Roster> existingRoster = rosterRepository.findByUser(employee);

            // Clear the existing roster entries for the employee, if any
            rosterRepository.deleteAll(existingRoster);

            // Generate the roster for the employee based on the selected WFO dates
            List<Roster> roster = generateCustomHybridEmployeeRoster(employee, wfoDates);

            // Save the generated roster entries to the database
            rosterRepository.saveAll(roster);
        }
    }

    // For particular employee to fetch his roster
    @Override
    public List<RosterDTO> getRoster(Long id) {
        User employee = userRepository.getOne(id);
        List<Roster> roster = rosterRepository.findByUser(employee);

        List<RosterDTO> rosterDTOList = new ArrayList<>();

        for (Roster rosterEntry : roster) {
            // Creating instance of roster DTO
            RosterDTO rosterDTO = new RosterDTO();

            rosterDTO.setDate(rosterEntry.getDate());
            rosterDTO.setType(rosterEntry.getType());

            rosterDTOList.add(rosterDTO);
        }

        return rosterDTOList;
    }

    // fetch all hybrid employees
    @Override
    public List<User> findHybridEmployee() {
        return userRepository.findByEmployeeType("Hybrid");
    }


    // helper function
    private List<Roster> generateCustomHybridEmployeeRoster(User employee, List<LocalDate> wfoDates) {
        List<Roster> roster = new ArrayList<>();

        // Get the current date
        LocalDate currentDate = LocalDate.now();

        // Determine the start and end dates for the roster (e.g., one month from the current date)
        LocalDate startDate = currentDate.plusDays(1); // Start from the next day
        LocalDate endDate = startDate.plusWeeks(2);

        // Generate the roster for each date within the specified range
        while (startDate.isBefore(endDate)) {


            if(startDate.getDayOfWeek() != DayOfWeek.SATURDAY
                    && startDate.getDayOfWeek() != DayOfWeek.SUNDAY
                    && !isHoliday(startDate)){


                String entryType = "WFH";
                for(LocalDate wfoDate : wfoDates){
                    //System.out.println("************************** WFO DATE => "+wfoDate);
                    if(startDate.equals(wfoDate)){
                        entryType = "WFO";
                    }
                }

                // Create a roster entry for the current date and employee
                Roster rosterEntry = new Roster();
                //System.out.println("************************** START DATE => "+startDate);
                rosterEntry.setDate(startDate);
                rosterEntry.setType(entryType);
                rosterEntry.setUser(employee);

                // Add the roster entry to the roster list
                roster.add(rosterEntry);
            }

            // Move to the next date
            startDate = startDate.plusDays(1);

        }

        return roster;
    }


    // check if date is holiday or not
    private boolean isHoliday(LocalDate date) {
        return holidayCalendarRepository.existsByHolidayDate(date);
    }
}

