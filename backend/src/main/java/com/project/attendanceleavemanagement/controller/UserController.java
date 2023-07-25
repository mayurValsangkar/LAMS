package com.project.attendanceleavemanagement.controller;

import com.project.attendanceleavemanagement.model.User;
import com.project.attendanceleavemanagement.model.UserAuthentication;
import com.project.attendanceleavemanagement.payload.*;
import com.project.attendanceleavemanagement.repository.UserAuthenticationRepository;
import com.project.attendanceleavemanagement.repository.UserRepository;
import com.project.attendanceleavemanagement.security.JwtTokenProvider;
import com.project.attendanceleavemanagement.service.UserService;
import com.project.attendanceleavemanagement.util.EmployeeExcelUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.IOException;
import java.util.List;

@Controller
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    AuthenticationManager authenticationManager;


    @Autowired
    private UserAuthenticationRepository userAuthenticationRepository;


    @Autowired
    JwtTokenProvider tokenProvider;


    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody SignUpRequest signUpRequest) {
        return userService.addEmployee(signUpRequest);
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<?> myProfile(@PathVariable("id") Long id) {
        return userService.searchProfileById(id);
    }


    @GetMapping("/profile")
    public ResponseEntity<?> myProfile(@RequestHeader("Authorization") String token) {
        if(StringUtils.hasText(token) && token.startsWith("Bearer ")) {
            String jwt = token.substring(7);
            Long userId = tokenProvider.getUserIdFromJWT(jwt);
            return userService.searchById(userId);
        }else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong");
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAll() {
        return userService.getAll();

    }

    @PostMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@RequestHeader("Authorization") String token, @RequestBody UpdateUser employee, @PathVariable("id") Long id) {
        return userService.updateEmployee(id, employee);
    }


    @PostMapping("/status/{id}")
    public ResponseEntity changeStatus(@PathVariable("id") Long id){
        return userService.changeStatus(id);
    }


    @PostMapping("/change_password")
    public ResponseEntity<?> changePassword(@RequestHeader("Authorization") String token, @RequestBody ChangePassword passwords) {
        return userService.changePassword(token, passwords);
    }

    @PostMapping("/bulk")
    public ResponseEntity<?> addBulkEmployees(@RequestParam("file") MultipartFile file) {
        try {
            List<SignUpRequest> signUpRequestList = EmployeeExcelUtil.parseEmployeesFromExcel(file);
            return userService.addBulkEmployees(signUpRequestList);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to parse the Excel file.");
        }
    }

    @GetMapping("/manager")
    public ResponseEntity getAllManagers(){
        return userService.getManagers();
    }
}
