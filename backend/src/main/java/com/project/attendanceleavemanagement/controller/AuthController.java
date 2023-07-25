package com.project.attendanceleavemanagement.controller;

import com.project.attendanceleavemanagement.model.User;
import com.project.attendanceleavemanagement.model.UserAuthentication;
import com.project.attendanceleavemanagement.payload.LoginRequest;
import com.project.attendanceleavemanagement.repository.DepartmentRepository;
import com.project.attendanceleavemanagement.repository.UserAuthenticationRepository;
import com.project.attendanceleavemanagement.repository.UserRepository;
import com.project.attendanceleavemanagement.security.JwtAuthenticationResponse;
import com.project.attendanceleavemanagement.security.JwtTokenProvider;
import com.project.attendanceleavemanagement.service.serviceImpl.EmailService;
import com.project.attendanceleavemanagement.service.UserService;
import org.apache.commons.lang3.RandomStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

//API endpoints within this controller are allowed to be accessed from any origin.
//The * wildcard means that requests from any domain are allowed.
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    DepartmentRepository departmentRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtTokenProvider tokenProvider;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;


    @Autowired
    private UserAuthenticationRepository userAuthenticationRepository;

    @Value("${spring.mail.username}")
    private String mailSender;

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Authenticate the user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsernameOrEmail().trim(),
                            loginRequest.getPassword().trim()
                    ));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Generate JWT token
            String jwt = tokenProvider.generateToken(authentication);

            // Finding user role
            User user = userRepository.findByUsernameOrEmail(loginRequest.getUsernameOrEmail(), loginRequest.getUsernameOrEmail()).get();

            if(user.getStatus().equalsIgnoreCase("Resigned") || user.getStatus().equalsIgnoreCase("Inactive")){
                return ResponseEntity.badRequest().body("Access Denied, Contact HR");
            }

            String role = "Employee";
            if(user!=null){
                role = user.getRole().toString();
            }



            LOGGER.info(">>> Successfully user login. (By ==> " + loginRequest.getUsernameOrEmail() + ")");
            return ResponseEntity.ok(new JwtAuthenticationResponse(true, jwt, role));
        } catch (Exception e) {
            LOGGER.error(">>> Unable to login. (By ==> " + loginRequest.getUsernameOrEmail() + ")", e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body( e.getLocalizedMessage());
        }
    }


    @GetMapping("/logout")
    public ResponseEntity<?> Logout(@RequestHeader("Authorization") String token){
        try {
            if(StringUtils.hasText(token) && token.startsWith("Bearer ")) {
                String jwt = token.substring(7);
                Long userId = tokenProvider.getUserIdFromJWT(jwt);

                User user = userRepository.getOne(userId);
                userRepository.save(user);
                LOGGER.info(">>> Successfully logout. (By ==> "+user.getId()+")");
                return ResponseEntity.ok().body("Successfully logout");
            }
            else {
                LOGGER.warn(">>> User authentication failed.");
                return ResponseEntity.ok().body("Authentication failed");
            }
        }catch (Exception e){
            LOGGER.error(">>> Unable to logout.", e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok().body( "Unable to logout");
        }
    }

    @PostMapping("/forgot/{email}")
    public ResponseEntity<?> forgotPassword(@PathVariable("email") String email) {

        try {
            if (!userRepository.existsByEmail(email.trim())) {
                return ResponseEntity.badRequest().body( "Email Id does not exist");
            } else {
                User user = userRepository.findByEmail(email);

                String password = RandomStringUtils.randomAlphabetic(6);
                String encodedPassword = passwordEncoder.encode(password);

                user.setPassword(encodedPassword);
                userRepository.save(user);

                UserAuthentication userAuthentication = new UserAuthentication(user.getId(), user.getUsername(), encodedPassword, user.getRole());
                userAuthenticationRepository.save(userAuthentication);

                emailService.forgotPasswordMail(user, password);
                return ResponseEntity.ok().body("Check email for confirm code");
            }

        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.badRequest().body( "Unable to change the password");
        }
    }
}
