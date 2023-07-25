package com.project.attendanceleavemanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDate;

@SpringBootApplication
@EnableScheduling
public class AttendanceLeaveManagementApplication {

	public static void main(String[] args) {

		SpringApplication.run(AttendanceLeaveManagementApplication.class, args);

		LocalDate currentDate = LocalDate.now();
		//System.out.println("*********************************** -> "+currentDate);

//		String password = "mayur123";
//		String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt());
//
//		System.out.println("Original password: " + password);
//		System.out.println("Hashed password: " + hashedPassword);
	}
}
