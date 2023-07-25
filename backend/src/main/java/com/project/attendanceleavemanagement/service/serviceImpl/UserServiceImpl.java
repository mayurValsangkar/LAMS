package com.project.attendanceleavemanagement.service.serviceImpl;

import com.project.attendanceleavemanagement.enums.RoleName;
import com.project.attendanceleavemanagement.model.Department;
import com.project.attendanceleavemanagement.model.Roster;
import com.project.attendanceleavemanagement.model.User;
import com.project.attendanceleavemanagement.model.UserAuthentication;
import com.project.attendanceleavemanagement.payload.*;
import com.project.attendanceleavemanagement.repository.DepartmentRepository;
import com.project.attendanceleavemanagement.repository.RosterRepository;
import com.project.attendanceleavemanagement.repository.UserAuthenticationRepository;
import com.project.attendanceleavemanagement.repository.UserRepository;
import com.project.attendanceleavemanagement.security.JwtTokenProvider;
import com.project.attendanceleavemanagement.service.UserService;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    PasswordEncoder passwordEncoder;


    @Autowired
    AuthenticationManager authenticationManager;


    @Autowired
    JwtTokenProvider jwtTokenProvider;


    @Autowired
    private RosterRepository rosterRepository;


    @Autowired
    private UserAuthenticationRepository userAuthenticationRepository;


    @Override
    public ResponseEntity<?> searchById(Long id) {

        try {
            User user = userRepository.getOne(id);

            Employee employee = new Employee();

            if(user.getManager()==null){
                user.setManager(user);
            }

            String rosterType = checkRoster(user);
            user.setRosterType(rosterType);

            // employee is DTO, converting user to employee DTO
            employee = new Employee(user.getId(),user.getFirstName(), user.getMiddleName(),
                    user.getLastName(),user.getGender(),user.getEmail(),
                    user.getUsername(),user.getMarriageStatus(), user.getCountry(),
                    user.getPermanentAddress(), user.getContactNumber(),
                    user.getEmergencyContactNumber(), user.getDob(), user.getJoinDate(),
                    user.getStatus(), user.getDesignation(), user.getJobTitle(), user.getEmployeeType(),
                    user.getRosterType(), user.getDepartment().getName(),
                    user.getManager().getFirstName() + " " + user.getManager().getLastName(),
                    user.getRole().toString());

            return ResponseEntity.ok().body(employee);
        } catch(Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok().body("Unable to get employee");
        }
    }

    // helper function
    public String checkRoster(User employee){
        // Get the current date
        LocalDate currentDate = LocalDate.now();

        Roster roster = rosterRepository.findByDateAndUser(currentDate, employee);
        return roster==null ? "WFH" : roster.getType();
    }

    // fetch all employees
    @Override
    public ResponseEntity<?> getAll() {
        try {
            List<User> users = userRepository.findAll();

            for(User user: users){
                if(user.getManager()==null){
                    user.setManager(user);
                }
            }

            // converting Entity to DTO
            List<Employee> employees = users.stream().map(user -> new Employee(user.getId(),user.getFirstName(), user.getMiddleName(),
                    user.getLastName(),user.getGender(),user.getEmail(),
                    user.getUsername(),user.getMarriageStatus(), user.getCountry(),
                    user.getPermanentAddress(), user.getContactNumber(),
                    user.getEmergencyContactNumber(), user.getDob(), user.getJoinDate(),
                    user.getStatus(), user.getDesignation(), user.getJobTitle(), user.getEmployeeType(),
                    user.getRosterType(), user.getDepartment().getName(),
                    user.getManager().getFirstName() + " " + user.getManager().getLastName(),
                    user.getRole().toString())).collect(Collectors.toList());


            return ResponseEntity.ok().body(employees);
        } catch(Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok().body("Unable to get all employees");
        }
    }

    @Override
    public ResponseEntity<?> updateEmployee(Long id, UpdateUser employee) {

        try {
            User employeeToUpdate = userRepository.getOne(id);

            // Check if email is unique
            User existingUserWithEmail = userRepository.findByEmail(employee.getEmail());
            if (existingUserWithEmail != null && !existingUserWithEmail.getId().equals(employeeToUpdate.getId())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is already in use by another user.");
            }

            // Check if username is unique
            User existingUserWithUsername = userRepository.findByUsername(employee.getUsername());
            if (existingUserWithUsername != null && !existingUserWithUsername.getId().equals(employeeToUpdate.getId())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username is already taken.");
            }

            // Set updated employee details
            employeeToUpdate.setFirstName(employee.getFirstName());
            employeeToUpdate.setMiddleName(employee.getMiddleName());
            employeeToUpdate.setLastName(employee.getLastName());
            employeeToUpdate.setGender(employee.getGender());
            employeeToUpdate.setEmail(employee.getEmail());
            employeeToUpdate.setUsername(employee.getUsername());
            employeeToUpdate.setMarriageStatus(employee.getMarriageStatus());
            employeeToUpdate.setCountry(employee.getCountry());
            employeeToUpdate.setPermanentAddress(employee.getPermanentAddress());
            employeeToUpdate.setContactNumber(employee.getContactNumber());
            employeeToUpdate.setEmergencyContactNumber(employee.getEmergencyContactNumber());

            // Parsing and setting date of birth
            LocalDate dob = employee.getDob();
            employeeToUpdate.setDob(dob);

            // Setting join date
            employeeToUpdate.setJoinDate(employee.getJoinDate());

            employeeToUpdate.setStatus(employee.getStatus());
            employeeToUpdate.setDesignation(employee.getDesignation());
            employeeToUpdate.setJobTitle(employee.getJobTitle());
            employeeToUpdate.setEmployeeType(employee.getEmployeeType());
            employeeToUpdate.setRosterType(employee.getRosterType());

            // Set department
            Department department = departmentRepository.getOne(employee.getDepartment());
            employeeToUpdate.setDepartment(department);

            // Set manager
            User manager = userRepository.getOne(employee.getManager());
            employeeToUpdate.setManager(manager);

            UserAuthentication userAuthentication = userAuthenticationRepository.findById(id).get();
            userAuthentication.setUsername(employeeToUpdate.getUsername());
            userAuthenticationRepository.save(userAuthentication);


            userRepository.save(employeeToUpdate);

            return ResponseEntity.ok().body("Successfully update the employee");
        } catch(Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body( "Unable to update the employee");
        }
    }

    @Override
    public ResponseEntity<?> addEmployee(SignUpRequest signUpRequest) {
        try{
                if (userRepository.existsByEmail(signUpRequest.getEmail())) {
                    return ResponseEntity.badRequest().body("Email Address already in use");
                }

                String password = RandomStringUtils.randomAlphabetic(6);
                String encodedPassword = passwordEncoder.encode(password);

            Optional<Department> optionalDepartment = departmentRepository.findById(signUpRequest.getDepartment());
            if (optionalDepartment.isEmpty()) {
                return ResponseEntity.badRequest().body("Unable to find Department with given id");
            }
            Department department = optionalDepartment.get();

                Long manager_id = Long.valueOf(signUpRequest.getManager());

                User manager = null;
                try {
                    manager = userRepository.getOne(manager_id);
                }catch (Exception e){
                    e.printStackTrace();
                    return ResponseEntity.badRequest().body( "Unable to find Manager with given id");
                }


                RoleName role = RoleName.Employee;

                if(signUpRequest.getRole().equalsIgnoreCase("Manager")){
                    role = RoleName.Manager;
                } else if (signUpRequest.getRole().equalsIgnoreCase("HR")) {
                    role = RoleName.HR;
                }

            User employee = new User(signUpRequest.getFirstName().trim(), signUpRequest.getMiddleName().trim(),
                        signUpRequest.getLastName().trim(), signUpRequest.getGender(),
                        signUpRequest.getEmail().trim(), signUpRequest.getUsername().trim(), encodedPassword,
                        signUpRequest.getMarriageStatus(), signUpRequest.getCountry().trim(),
                        signUpRequest.getPermanentAddress().trim(),
                        signUpRequest.getContactNumber().trim(), signUpRequest.getEmergencyContactNumber().trim(),
                        signUpRequest.getDob(), signUpRequest.getJoinDate(), signUpRequest.getStatus(),
                        signUpRequest.getDesignation(), signUpRequest.getJobTitle(),
                        signUpRequest.getEmployeeType(), signUpRequest.getRosterType(),
                        department, manager, role);


                Boolean success = emailService.sendPassword(employee, password);

                if(success) {
                    User result = userRepository.save(employee);

                    UserAuthentication userAuthentication = new UserAuthentication(employee.getId(), employee.getUsername(), encodedPassword, employee.getRole());
                    userAuthenticationRepository.save(userAuthentication);

                    return ResponseEntity.ok().body("Successfully create the employee.");
                } else {
                    return ResponseEntity.badRequest().body("Invalid email. Please check");
                }

        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Unable to create the employee");
        }
    }


    @Override
    public ResponseEntity<?> changePassword(String token, ChangePassword passwords) {
        try {
            if (StringUtils.hasText(token) && token.startsWith("Bearer ")) {
                String jwt = token.substring(7);
                Long id = jwtTokenProvider.getUserIdFromJWT(jwt);

                User user = null;
                try{
                    user = userRepository.findByEmail(passwords.getEmail());
                }catch (Exception e){
                    e.printStackTrace();
                    return ResponseEntity.badRequest().body("Email id does not exist");
                }


                Authentication authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                user.getUsername(),
                                passwords.getCurrentPassword().trim()
                        ));
                SecurityContextHolder.getContext().setAuthentication(authentication);

                String password = passwordEncoder.encode(passwords.getNewPassword().trim());
                user.setPassword(password);
                userRepository.save(user);

                UserAuthentication userAuthentication = userAuthenticationRepository.findById(user.getId()).get();
                userAuthentication.setPassword(password);
                userAuthenticationRepository.save(userAuthentication);

                emailService.updatePasswordEmail(user, passwords.getNewPassword());

                return ResponseEntity.ok("Successfully changed the password");
            } else {
                return ResponseEntity.ok().body("Authentication failed");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok().body("Current password did not match");
        }
    }

    @Override
    public ResponseEntity<?> changeStatus(Long id) {
        try {
            // Check if the employee exists
            if (!userRepository.existsById(id)) {
                return ResponseEntity.badRequest().body("Employee not found");
            }

            User user = userRepository.getOne(id);

            if(user.getStatus().equalsIgnoreCase("Working") || user.getStatus().equalsIgnoreCase("Active")){
                user.setStatus("Inactive");
            } else if (user.getStatus().equalsIgnoreCase("Resigned") || user.getStatus().equalsIgnoreCase("Inactive")) {
                user.setStatus("Active");
            }

            userRepository.save(user);

            return ResponseEntity.ok().body("Employee status changed successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body( "Unable to change the status of the employee");
        }
    }

    @Override
    public ResponseEntity<?> searchProfileById(Long id) {
        try {
            User user = userRepository.getOne(id);

            UserProfileDTO userProfileDTO = new UserProfileDTO();

            if (user.getManager() == null) {
                user.setManager(user);
            }

            userProfileDTO = new UserProfileDTO(
                    user.getId(),
                    user.getFirstName(),
                    user.getMiddleName(),
                    user.getLastName(),
                    user.getGender(),
                    user.getEmail(),
                    user.getUsername(),
                    user.getMarriageStatus(),
                    user.getCountry(),
                    user.getPermanentAddress(),
                    user.getContactNumber(),
                    user.getEmergencyContactNumber(),
                    user.getDob(),
                    user.getJoinDate(),
                    user.getStatus(),
                    user.getDesignation(),
                    user.getJobTitle(),
                    user.getEmployeeType(),
                    user.getRosterType(),
                    user.getDepartment().getId(), // Set department as ID
                    user.getManager().getId(), // Set manager as ID
                    user.getRole().toString()
            );

            return ResponseEntity.ok().body(userProfileDTO);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok().body("Unable to get employee");
        }
    }

    // fetch all managers
    @Override
    public ResponseEntity getManagers() {
        try {

            boolean hrAdded = false;

            List<User> userList = userRepository.findAll();

            List<User> managerList = new ArrayList<>();

            for (User user : userList) {
                if (user.getRole().toString().equalsIgnoreCase("Manager")) {
                    managerList.add(user);
                } else if (user.getRole().toString().equalsIgnoreCase("HR") && !hrAdded) {
                    managerList.add(user);
                    hrAdded = true;
                }
            }
            return ResponseEntity.ok(managerList);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unable to get managers");
        }
    }


    @Override
    public ResponseEntity addBulkEmployees(List<SignUpRequest> signUpRequestList) {

        int count = 0; // Counter for successfully added employees

        for (SignUpRequest signUpRequest : signUpRequestList) {
            try {
                ResponseEntity<?> response = addEmployee(signUpRequest);

                if (response.getStatusCode().is2xxSuccessful()) {
                    count++;
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        if (count > 0) {
            return ResponseEntity.ok().body("Successfully added " + count + " employees out of " + signUpRequestList.size());
        } else {
            return ResponseEntity.badRequest().body("Failed to add any employee.");
        }
    }


}
