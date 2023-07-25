package com.project.attendanceleavemanagement.service.serviceImpl;

import com.project.attendanceleavemanagement.enums.LeaveApplicationStatus;
import com.project.attendanceleavemanagement.enums.LeaveTypeName;
import com.project.attendanceleavemanagement.model.LeaveApplication;
import com.project.attendanceleavemanagement.model.LeaveBalance;
import com.project.attendanceleavemanagement.model.User;
import com.project.attendanceleavemanagement.payload.LeaveRequest;
import com.project.attendanceleavemanagement.repository.HolidayCalenderRepository;
import com.project.attendanceleavemanagement.repository.LeaveApplicationRepository;
import com.project.attendanceleavemanagement.repository.LeaveBalanceRepository;
import com.project.attendanceleavemanagement.repository.UserRepository;
import com.project.attendanceleavemanagement.service.LeaveRequestService;
import com.project.attendanceleavemanagement.util.LeaveDurationCalculator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class LeaveRequestServiceImpl implements LeaveRequestService {


    @Autowired
    private LeaveApplicationRepository leaveApplicationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HolidayCalenderRepository holidayCalendarRepository;

    @Autowired
    private LeaveBalanceRepository leaveBalanceRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    LeaveDurationCalculator leaveDurationCalculator;


    private static final Logger LOGGER = LoggerFactory.getLogger(LeaveRequestService.class);

    @Override
    public LeaveApplication applyForLeave(LeaveRequest leaveRequest, Long userId) {
        // Check if the start date is a holiday
        LocalDate startDate = leaveRequest.getStartDate();
        boolean isStartDateHoliday = holidayCalendarRepository.existsByHolidayDate(startDate);

        if (isStartDateHoliday) {
            throw new IllegalArgumentException("Leave cannot be applied on a holiday");
        }

        // Check leave balance according to leave type
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));

        LeaveTypeName leaveType = leaveRequest.getLeaveType();

        // Check if the leave type is valid based on the user's gender
        if (user.getGender().trim().equalsIgnoreCase("MALE") && leaveType == LeaveTypeName.Maternity) {
            throw new IllegalArgumentException("Male employees cannot apply for maternity leave");
        } else if (user.getGender().trim().equalsIgnoreCase("FEMALE") && leaveType == LeaveTypeName.Paternity) {
            throw new IllegalArgumentException("Female employees cannot apply for paternity leave");
        }


        // For comp_off we don't have/her to create his leave balance account
        if(!leaveType.toString().equalsIgnoreCase("Comp_off")){

            LeaveBalance leaveBalance = leaveBalanceRepository.findByUserAndType(user, leaveType);

            // First time applying leave -> creating his/her leave balance account
            if (leaveBalance == null) {
                leaveBalance = new LeaveBalance();
                leaveBalance.setUser(user);
                leaveBalance.setType(leaveType);
                leaveBalance.setAppliedLeaves(1);
                leaveBalance.setTotalLeaves(0);

                switch (leaveType) {
                    case Sick:
                    case Casual:
                    case Personal:
                    case Marriage:
                        leaveBalance.setRemainingLeaves(15);
                        break;
                    case Maternity:
                        leaveBalance.setRemainingLeaves(180);
                        break;
                    case Paternity:
                    default:
                        leaveBalance.setRemainingLeaves(10);
                        break;
                }
            }else {
                leaveBalance.setAppliedLeaves(leaveBalance.getAppliedLeaves() + 1);
            }

            if (leaveBalance.getRemainingLeaves() <= 0) {
                throw new IllegalArgumentException("Insufficient leave balance");
            }

            leaveBalanceRepository.save(leaveBalance);
        }


        // Create the leave application entity
        LeaveApplication leaveApplication = new LeaveApplication();
        leaveApplication.setUser(user);
        leaveApplication.setStartDate(leaveRequest.getStartDate());
        leaveApplication.setEndDate(leaveRequest.getEndDate());
        leaveApplication.setSpecificReason(leaveRequest.getSpecificReason());
        leaveApplication.setLeaveType(leaveRequest.getLeaveType());
        leaveApplication.setStatus(LeaveApplicationStatus.PENDING);
        leaveApplication.setUserId(userId);

        // Save the leave application
        leaveApplication = leaveApplicationRepository.save(leaveApplication);


        // Send email to the user's manager
        User manager = user.getManager();
        emailService.sendLeaveApprovalNotification(manager.getEmail(), leaveApplication);

        return leaveApplication;
    }


    public List<LeaveApplication> getAll() {
        List<LeaveApplication> leaveApplicationList = new ArrayList<>();
        try {
            leaveApplicationList = leaveApplicationRepository.findAll();
            Collections.sort(leaveApplicationList, Comparator.comparingLong(LeaveApplication::getId).reversed());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return leaveApplicationList;
    }

    public List<LeaveApplication> getOneEmployeeLeaveRequests(Long employeeId) {
        List<LeaveApplication> leaves = new ArrayList<>();
        try {
            User employee = userRepository.getOne(employeeId);
            leaves = leaveApplicationRepository.findByUser(employee);
            Collections.sort(leaves, Comparator.comparingLong(LeaveApplication::getId).reversed());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return leaves;
    }


    @PostConstruct
    @Scheduled(cron = "0 17 * * 5 *")
    public void sendEmailsToSupervisors(){
        System.out.println("\n\n\nRun the schedule--------------------------\n\n\n");
        try {
            List<User> workingEmployees = userRepository.findByStatus("Working");
            List<String> managers = new ArrayList<>();

            for (User user : workingEmployees) {
                if(leaveApplicationRepository.existsByUserAndStatus(user, LeaveApplicationStatus.PENDING) ) {
                    if(!user.getManager().equals(null)){
                        emailService.informPendingLeaves(user.getManager());
                    }
                }
            }
        }
        catch (Exception e){
            e.printStackTrace();
        }
    }


    public LeaveApplication approveLeaveRequest(Long leaveRequestId) {
        LeaveApplication leaveRequest = getLeaveRequestById(leaveRequestId);
        leaveRequest.setStatus(LeaveApplicationStatus.APPROVED);

        LeaveBalance leaveBalance = leaveBalanceRepository.findByUserAndType(leaveRequest.getUser(), leaveRequest.getLeaveType());
        if (leaveBalance != null && !leaveRequest.getLeaveType().toString().equalsIgnoreCase("Comp_off")) {
            int leaveDuration = leaveDurationCalculator.calculateLeaveDuration(leaveRequest.getStartDate(), leaveRequest.getEndDate());
            int remainingLeaves = leaveBalance.getRemainingLeaves() - leaveDuration;
            leaveBalance.setRemainingLeaves(remainingLeaves);
            leaveBalance.setTotalLeaves(leaveBalance.getTotalLeaves() + leaveDuration);
            leaveBalanceRepository.save(leaveBalance);
        }

        // Send email notification to the employee
        User employee = leaveRequest.getUser();
        String employeeEmail = employee.getEmail();
        emailService.sendLeaveRequestApprovedNotification(employeeEmail, leaveRequest);

        return leaveApplicationRepository.save(leaveRequest);
    }

    public LeaveApplication rejectLeaveRequest(Long leaveRequestId) {
        LeaveApplication leaveRequest = getLeaveRequestById(leaveRequestId);
        leaveRequest.setStatus(LeaveApplicationStatus.REJECTED);


        // Send email notification to the employee
        User employee = leaveRequest.getUser();
        String employeeEmail = employee.getEmail();
        emailService.sendLeaveRequestRejectedNotification(employeeEmail, leaveRequest);

        return leaveApplicationRepository.save(leaveRequest);
    }

    private LeaveApplication getLeaveRequestById(Long leaveRequestId) {
        Optional<LeaveApplication> optionalLeaveRequest = leaveApplicationRepository.findById(leaveRequestId);
        if (optionalLeaveRequest.isEmpty()) {
            throw new IllegalArgumentException("Leave request not found");
        }
        return optionalLeaveRequest.get();
    }


    @Override
    public List<LeaveApplication> getPendingLeaveRequests() {
        return leaveApplicationRepository.findByStatus(LeaveApplicationStatus.PENDING);
    }
}
