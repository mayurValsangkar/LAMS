package com.project.attendanceleavemanagement.service.serviceImpl;

import com.project.attendanceleavemanagement.enums.RoleName;
import com.project.attendanceleavemanagement.model.Attendance;
import com.project.attendanceleavemanagement.model.LeaveApplication;
import com.project.attendanceleavemanagement.model.User;
import com.project.attendanceleavemanagement.payload.SignUpRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.stereotype.Service;

import javax.mail.Message;
import javax.mail.internet.InternetAddress;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String mailSender;

    public void sendAttendanceNotification(String managerEmail, Attendance attendance) {

        MimeMessagePreparator mail = mimeMessage -> {
            mimeMessage.setRecipient(Message.RecipientType.TO, new InternetAddress(managerEmail));
            mimeMessage.setFrom(new InternetAddress(mailSender, "LAMS"));
            mimeMessage.setSubject("Attendance Notification");
            mimeMessage.setText("Dear Manager,\n\n"
                    + "This is to inform you that the following attendance has been marked:\n\n"
                    + "User: " + attendance.getUser().getFirstName()+" "+attendance.getUser().getLastName() + "\n"
                    + "Date: " + attendance.getDate() + "\n"
                    + "Time: " + attendance.getTime() + "\n"
                    + "Status: " + attendance.getStatus() + "\n\n"
                    + "Please take necessary action.\n\n"
                    + "Best Regards,\nLAMS Team");
        };

        try {
            InternetAddress internetAddress = new InternetAddress(managerEmail);
            internetAddress.validate();
            javaMailSender.send(mail);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    public void sendMultipleAttendanceNotification(String managerEmail, List<Attendance> attendanceList) {
        MimeMessagePreparator mail = mimeMessage -> {
            mimeMessage.setRecipient(Message.RecipientType.TO, new InternetAddress(managerEmail));
            mimeMessage.setFrom(new InternetAddress(mailSender, "LAMS"));
            mimeMessage.setSubject("Attendance Notification");

            StringBuilder messageBuilder = new StringBuilder();
            messageBuilder.append("Dear Manager,\n\n");
            messageBuilder.append("The following attendances have been marked by ").append(attendanceList.get(0).getUser().getFirstName()).append(" ").append(attendanceList.get(0).getUser().getLastName()).append(":\n\n");

            for (Attendance attendance : attendanceList) {
                messageBuilder.append("Date: ").append(attendance.getDate()).append("\n");
                messageBuilder.append("Time: ").append(attendance.getTime()).append("\n");
                messageBuilder.append("Status: ").append(attendance.getStatus()).append("\n\n");
            }

            messageBuilder.append("Please take necessary action.\n\n");
            messageBuilder.append("Best Regards,\nLAMS Team");

            mimeMessage.setText(messageBuilder.toString());
        };

        try {
            InternetAddress internetAddress = new InternetAddress(managerEmail);
            internetAddress.validate();
            javaMailSender.send(mail);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public Boolean sendPassword(User user, String password) {
        MimeMessagePreparator mail = mimeMessage -> {
            mimeMessage.setRecipient(Message.RecipientType.TO, new InternetAddress(user.getEmail()));
            mimeMessage.setFrom(new InternetAddress(mailSender, "LAMS"));
            mimeMessage.setSubject("Credentials For Leave Attendance Management System.");

            String emailContent;
            if (user.getRole() == RoleName.HR) {
                emailContent = "Hi " + user.getFirstName() + " " + user.getLastName() + ",\n\n" +
                        "Credentials for your new Account in Leave and Attendance Management System as follows. You can change your password when you logged in to your account.\n\n" +
                        "Employee Username - " + user.getUsername() + ".\n" +
                        "Password - " + password + ".\n\n" +
                        "For assistance in operating the portal, you can refer to this document: " +"\n"+
                        "https://drive.google.com/file/d/1fi8vhq6B5rgun2aZv5GWc_aL9GAul1qA/view?usp=sharing"+"\n\n"+
                        "Best Regards\nLAMS Team\n\n";

            } else if (user.getRole() == RoleName.Manager) {
                emailContent = "Hi " + user.getFirstName() + " " + user.getLastName() + ",\n\n" +
                        "Credentials for your new Account in Leave and Attendance Management System as follows. You can change your password when you logged in to your account.\n\n" +
                        "Employee Username - " + user.getUsername() + ".\n" +
                        "Password - " + password + ".\n\n" +
                        "For assistance in operating the portal, you can refer to this document: " +"\n"+
                        "https://drive.google.com/file/d/1adojR5h-asGnJ4PgSEsgRP4QMD0EvBdU/view?usp=sharing"+"\n\n" +
                        "Best Regards\nLAMS Team\n\n";

            } else {
                // for employee
                emailContent = "Hi " + user.getFirstName() + " " + user.getLastName() + ",\n\n" +
                        "Credentials for your new Account in Leave and Attendance Management System as follows. You can change your password when you logged in to your account.\n\n" +
                        "Employee Username - " + user.getUsername() + ".\n" +
                        "Password - " + password + ".\n\n" +
                        "For assistance in operating the portal, you can refer to this document: " +"\n"+
                        "https://drive.google.com/file/d/11J5-VY7GaVqvQGWkRXVSpe0JE-0uIpIi/view?usp=sharing" +".\n\n" +
                        "Best Regards\nLAMS Team\n\n";
            }

            mimeMessage.setText(emailContent);
        };

        try {
            InternetAddress internetAddress = new InternetAddress(user.getEmail());
            internetAddress.validate();
            javaMailSender.send(mail);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public void sendLeaveApprovalNotification(String managerEmail, LeaveApplication leaveApplication) {

        MimeMessagePreparator mail = mimeMessage -> {
            mimeMessage.setRecipient(Message.RecipientType.TO, new InternetAddress(managerEmail));
            mimeMessage.setFrom(new InternetAddress(mailSender, "LAMS"));
            mimeMessage.setSubject("Leave Approval Notification");
            mimeMessage.setText("Dear Manager,\n\n"
                    + "A leave application requires your approval:\n\n"
                    + "User: " + leaveApplication.getUser().getFirstName() + " " + leaveApplication.getUser().getLastName() + "\n"
                    + "Leave Type: " + leaveApplication.getLeaveType() + "\n"
                    + "Start Date: " + leaveApplication.getStartDate() + "\n"
                    + "End Date: " + leaveApplication.getEndDate() + "\n"
                    + "Reason: " + leaveApplication.getSpecificReason() + "\n\n"
                    + "Please take necessary action.\n\n"
                    + "Best Regards,\nLAMS Team");
        };

        try {
            InternetAddress internetAddress = new InternetAddress(managerEmail);
            internetAddress.validate();
            javaMailSender.send(mail);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void informPendingLeaves(User user) {

        MimeMessagePreparator mail = mimeMessage -> {

            mimeMessage.setRecipient(Message.RecipientType.TO, new InternetAddress(user.getEmail()));
            mimeMessage.setFrom(new InternetAddress(mailSender, "LAMS"));
            mimeMessage.setSubject("Pending Leave Requests.");
            mimeMessage.setText(
                    "Hi "+user.getFirstName()+" "+user.getLastName()+",\n\n"+
                            "There are some leaves pending to get your approval. \n"+
                            "\nBest Regards\nLAMS Team");
        };

        try {
            javaMailSender.send(mail);
        }catch (Exception e){
            e.printStackTrace();
        }
    }


    public void sendAttendanceApprovedNotification(String employeeEmail, Attendance attendance) {
        MimeMessagePreparator mail = mimeMessage -> {
            mimeMessage.setRecipient(Message.RecipientType.TO, new InternetAddress(employeeEmail));
            mimeMessage.setFrom(new InternetAddress(mailSender, "LAMS"));
            mimeMessage.setSubject("Attendance Approved Notification");
            mimeMessage.setText("Dear Employee,\n\n"
                    + "Your attendance has been approved:\n\n"
                    + "Date: " + attendance.getDate() + "\n"
                    + "Time: " + attendance.getTime() + "\n"
                    + "Status: " + attendance.getStatus() + "\n\n"
                    + "Best Regards,\nLAMS Team");
        };

        try {
            InternetAddress internetAddress = new InternetAddress(employeeEmail);
            internetAddress.validate();
            javaMailSender.send(mail);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void sendLeaveRequestApprovedNotification(String employeeEmail, LeaveApplication leaveApplication) {
        MimeMessagePreparator mail = mimeMessage -> {
            mimeMessage.setRecipient(Message.RecipientType.TO, new InternetAddress(employeeEmail));
            mimeMessage.setFrom(new InternetAddress(mailSender, "LAMS"));
            mimeMessage.setSubject("Leave Request Approved Notification");
            mimeMessage.setText("Dear Employee,\n\n"
                    + "Your leave request has been approved:\n\n"
                    + "Leave Type: " + leaveApplication.getLeaveType() + "\n"
                    + "Start Date: " + leaveApplication.getStartDate() + "\n"
                    + "End Date: " + leaveApplication.getEndDate() + "\n"
                    + "Reason: " + leaveApplication.getSpecificReason() + "\n\n"
                    + "Best Regards,\nLAMS Team");
        };

        try {
            InternetAddress internetAddress = new InternetAddress(employeeEmail);
            internetAddress.validate();
            javaMailSender.send(mail);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    public void sendAttendanceRejectedNotification(String employeeEmail, Attendance attendance) {
        MimeMessagePreparator mail = mimeMessage -> {
            mimeMessage.setRecipient(Message.RecipientType.TO, new InternetAddress(employeeEmail));
            mimeMessage.setFrom(new InternetAddress(mailSender, "LAMS"));
            mimeMessage.setSubject("Attendance Rejected Notification");
            mimeMessage.setText("Dear Employee,\n\n"
                    + "Your attendance has been rejected:\n\n"
                    + "Date: " + attendance.getDate() + "\n"
                    + "Time: " + attendance.getTime() + "\n"
                    + "Status: " + attendance.getStatus() + "\n\n"
                    + "Best Regards,\nLAMS Team");
        };

        try {
            InternetAddress internetAddress = new InternetAddress(employeeEmail);
            internetAddress.validate();
            javaMailSender.send(mail);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void sendLeaveRequestRejectedNotification(String employeeEmail, LeaveApplication leaveApplication) {
        MimeMessagePreparator mail = mimeMessage -> {
            mimeMessage.setRecipient(Message.RecipientType.TO, new InternetAddress(employeeEmail));
            mimeMessage.setFrom(new InternetAddress(mailSender, "LAMS"));
            mimeMessage.setSubject("Leave Request Rejected Notification");
            mimeMessage.setText("Dear Employee,\n\n"
                    + "Your leave request has been rejected:\n\n"
                    + "Leave Type: " + leaveApplication.getLeaveType() + "\n"
                    + "Start Date: " + leaveApplication.getStartDate() + "\n"
                    + "End Date: " + leaveApplication.getEndDate() + "\n"
                    + "Reason: " + leaveApplication.getSpecificReason() + "\n\n"
                    + "Best Regards,\nLAMS Team");
        };

        try {
            InternetAddress internetAddress = new InternetAddress(employeeEmail);
            internetAddress.validate();
            javaMailSender.send(mail);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void attendanceReminder(User user, LocalDate date) {
        MimeMessagePreparator mail = mimeMessage -> {
            mimeMessage.setRecipient(Message.RecipientType.TO, new InternetAddress(user.getEmail()));
            mimeMessage.setFrom(new InternetAddress(mailSender, "LAMS"));
            mimeMessage.setSubject("Attendance Reminder");
            mimeMessage.setText("Dear " + user.getFirstName() + " " + user.getLastName() + ",\n\n"
                    + "This is a reminder to mark your attendance for " + date.format(DateTimeFormatter.ofPattern("dd MMM yyyy")) + ".\n\n"
                    + "Please log in to the LAMS portal and mark your attendance.\n\n"
                    + "Note: If this day is a holiday, if you are on leave, or if you have already marked your attendance, kindly ignore this message.\n\n"
                    + "Best Regards,\nLAMS Team");
        };

        try {
            InternetAddress internetAddress = new InternetAddress(user.getEmail());
            internetAddress.validate();
            javaMailSender.send(mail);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void forgotPasswordMail(User user, String newPassword) {

        MimeMessagePreparator mail = mimeMessage -> {
            mimeMessage.setRecipient(Message.RecipientType.TO, new InternetAddress(user.getEmail()));
            mimeMessage.setFrom(new InternetAddress(mailSender, "LAMS"));
            mimeMessage.setSubject("Forgot Password - LAMS");
            mimeMessage.setText("Dear " + user.getFirstName() + " " + user.getLastName() + ",\n\n"
                    + "You have requested a new password for your LAMS account.\n"
                    + "Your new password is: " + newPassword + "\n\n"
                    + "Please login to LAMS using this password and change it immediately.\n\n"
                    + "If you did not request a password reset, please ignore this email.\n\n"
                    + "Best Regards,\nLAMS Team");
        };

        try {
            InternetAddress internetAddress = new InternetAddress(user.getEmail());
            internetAddress.validate();
            javaMailSender.send(mail);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    public void updatePasswordEmail(User user, String updatedPassword) {

        MimeMessagePreparator mail = mimeMessage -> {
            mimeMessage.setRecipient(Message.RecipientType.TO, new InternetAddress(user.getEmail()));
            mimeMessage.setFrom(new InternetAddress(mailSender, "LAMS"));
            mimeMessage.setSubject("Password Updated - LAMS");
            mimeMessage.setText("Dear " + user.getFirstName() + " " + user.getLastName() + ",\n\n"
                    + "Your password has been successfully updated for your LAMS account.\n"
                    + "Your new password is: " + updatedPassword + "\n\n"
                    + "Please login to LAMS using your new password and change it immediately.\n\n"
                    + "If you did not perform this password update, please contact our support team immediately.\n\n"
                    + "Best Regards,\nLAMS Team");
        };

        try {
            InternetAddress internetAddress = new InternetAddress(user.getEmail());
            internetAddress.validate();
            javaMailSender.send(mail);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
