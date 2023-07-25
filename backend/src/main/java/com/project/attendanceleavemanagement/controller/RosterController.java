package com.project.attendanceleavemanagement.controller;

import com.project.attendanceleavemanagement.model.User;
import com.project.attendanceleavemanagement.payload.Employee;
import com.project.attendanceleavemanagement.payload.RosterDTO;
import com.project.attendanceleavemanagement.payload.RosterUploadRequest;
import com.project.attendanceleavemanagement.security.JwtTokenProvider;
import com.project.attendanceleavemanagement.service.RosterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/roster")
public class RosterController {


    @Autowired
    private RosterService rosterService;


    @Autowired
    JwtTokenProvider tokenProvider;

    @PostMapping("/upload")
    public ResponseEntity<String> generateCustomRosterForEmployees(@RequestBody RosterUploadRequest request) {
        try {
            // Call the RosterService to generate the custom roster for the specified employees
            List<Long> employeeIds = request.getEmployeeIds();
            List<LocalDate> wfoDates = request.getWfoDates();
//            for(LocalDate date : wfoDates){
//                System.out.println("****************** CONTROLLER => "+date);
//            }
            rosterService.generateCustomHybridRosterForEmployees(employeeIds, wfoDates);

            return ResponseEntity.ok("Roster uploaded successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload roster.");
        }
    }


    @GetMapping("/view")
    public ResponseEntity getCurrentUserRoster(@RequestHeader("Authorization") String token){
        try {
            // Call the RosterService to generate the custom roster for the specified employees
            if(StringUtils.hasText(token) && token.startsWith("Bearer ")) {
                String jwt = token.substring(7);
                Long userId = tokenProvider.getUserIdFromJWT(jwt);
                List<RosterDTO> rosterDTOList = rosterService.getRoster(userId);
                return ResponseEntity.ok().body(rosterDTOList);
            }
            else{
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
                }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch roster.");
        }
    }

    @GetMapping("/employee")
    public ResponseEntity getHybridEmployees(){
        try{
            List<User> employeeList = rosterService.findHybridEmployee();
            return ResponseEntity.ok().body(employeeList);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch employees");
        }
    }
}
