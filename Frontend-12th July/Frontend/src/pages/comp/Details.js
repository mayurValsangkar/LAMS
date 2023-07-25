import { Box, Center, Flex, Text } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  MdPerson,
  MdWork,
  MdAccountCircle,
  MdEventNote,
  MdFileText,
  MdAssignmentInd,
  MdAssignment,
  MdHistory,
  MdDescription,
  MdPowerSettingsNew,
} from "react-icons/md";
import AttendanceRecord from "./AttendanceRecord";
import LeaveRecord from "./LeaveRecord";
import LeaveManagement from "./LeaveManagement";
import AttendanceManagement from "./AttendaceManagement";
import LeaveApply from "./LeaveApply";
import Attendance from "./Attendance";
import MyProfile from "./MyProfile";
import Holiday from "./Holiday";
import Signup from "./Signup";
import EmployeeDetails from "./EmployeeDetails";
import UpdateProfile from "./UpdateProfile";
import Roster from "./Roster";
import Department from "./Department";
import UploadRoster from "./UploadRoster";
import Documents from "./Documents";
import { fetchProfile } from "../../components/ApiServices";
import Helpus from "./Helpus";
import { AiOutlineQuestionCircle } from "react-icons/ai";

const Details = () => {
  const [selectedOption, setSelectedOption] = useState("My Profile");
  const history = useHistory();
  const userRole = sessionStorage.getItem("role");
  const [employee, setEmployee] = useState({});

  useEffect(() => {
    const fetchEmployeeProfile = async () => {
      try {
        const data = await fetchProfile();
        setEmployee(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchEmployeeProfile();
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <Flex width="100%" height="100%">
      <Box
        width="30vw"
        height="100%"
        display="flex"
        flexDirection="column"
      >
        <Box
          display="flex"
          flexDirection="column"
          padding={3}
          bg="#F8F8F8"
          borderRadius="lg"
          overflowY="auto"
        >
          <Text
            as="button"
            cursor="pointer"
            bg={selectedOption === "My Profile" ? "blue.400" : "blue.100"}
            color={selectedOption === "My Profile" ? "black" : "gray.600"}
            px={3}
            py={2}
            borderRadius="lg"
            marginBottom={2}
            onClick={() => handleOptionClick("My Profile")}
          >
            <MdAccountCircle size={16} color="black" />
            <Text ml={2} fontWeight="bold">
              My Profile
            </Text>
          </Text>

          <Text
            as="button"
            cursor="pointer"
            bg={selectedOption === "Update Profile" ? "blue.400" : "blue.100"}
            color={selectedOption === "Update Profile" ? "black" : "gray.600"}
            px={3}
            py={2}
            borderRadius="lg"
            marginBottom={2}
            onClick={() => handleOptionClick("Update Profile")}
          >
            <MdAccountCircle size={16} color="black" />
            <Text ml={2} fontWeight="bold">
              Update Profile
            </Text>
          </Text>

          {userRole === "HR" && (
            <>
              <Text
                as="button"
                cursor="pointer"
                bg={
                  selectedOption === "Register Employee"
                    ? "blue.400"
                    : "blue.100"
                }
                color={
                  selectedOption === "Register Employee" ? "black" : "gray.600"
                }
                px={3}
                py={2}
                borderRadius="lg"
                marginBottom={2}
                onClick={() => handleOptionClick("Register Employee")}
              >
                <MdAssignmentInd size={16} color="black" />
                <Text ml={2} fontWeight="bold">
                 Add Employee
                </Text>
              </Text>
              <Text
                as="button"
                cursor="pointer"
                bg={
                  selectedOption === "Employee Details"
                    ? "blue.400"
                    : "blue.100"
                }
                color={
                  selectedOption === "Employee Details" ? "black" : "gray.600"
                }
                px={3}
                py={2}
                borderRadius="lg"
                marginBottom={2}
                onClick={() => handleOptionClick("Employee Details")}
              >
                <MdPerson size={16} color="black" />
                <Text ml={2} fontWeight="bold">
                  Employee Details
                </Text>
              </Text>
              <Text
                as="button"
                cursor="pointer"
                bg={selectedOption === "Department" ? "blue.400" : "blue.100"}
                color={selectedOption === "Department" ? "black" : "gray.600"}
                px={3}
                py={2}
                borderRadius="lg"
                marginBottom={2}
                onClick={() => handleOptionClick("Department")}
              >
                <MdAssignment size={16} color="black" />
                <Text ml={2} fontWeight="bold">
                  Department
                </Text>
              </Text>
            </>
          )}

                    <Text
            as="button"
            cursor="pointer"
            bg={selectedOption === "Attendance" ? "blue.400" : "blue.100"}
            color={selectedOption === "Attendance" ? "black" : "gray.600"}
            px={3}
            py={2}
            borderRadius="lg"
            marginBottom={2}
            onClick={() => handleOptionClick("Attendance")}
          >
            <MdWork size={16} color="black" />
            <Text ml={2} fontWeight="bold">
              Attendance
            </Text>
          </Text>

          {(userRole === "HR" || userRole === "Manager") && (
            <>
              <Text
                as="button"
                cursor="pointer"
                bg={
                  selectedOption === "Attendance Management"
                    ? "blue.400"
                    : "blue.100"
                }
                color={
                  selectedOption === "Attendance Management"
                    ? "black"
                    : "gray.600"
                }
                px={3}
                py={2}
                borderRadius="lg"
                marginBottom={2}
                onClick={() => handleOptionClick("Attendance Management")}
              >
                <MdWork size={16} color="black" />
                <Text ml={2} fontWeight="bold">
                  Attendance Management
                </Text>
              </Text>

                        <Text
            as="button"
            cursor="pointer"
            bg={selectedOption === "Leave Apply" ? "blue.400" : "blue.100"}
            color={selectedOption === "Leave Apply" ? "black" : "gray.600"}
            px={3}
            py={2}
            borderRadius="lg"
            marginBottom={2}
            onClick={() => handleOptionClick("Leave Apply")}
          >
            <MdAssignment size={16} color="black" />
            <Text ml={2} fontWeight="bold">
              Leave Apply
            </Text>
          </Text>

              <Text
                as="button"
                cursor="pointer"
                bg={
                  selectedOption === "Leave Management"
                    ? "blue.400"
                    : "blue.100"
                }
                color={
                  selectedOption === "Leave Management" ? "black" : "gray.600"
                }
                px={3}
                py={2}
                borderRadius="lg"
                marginBottom={2}
                onClick={() => handleOptionClick("Leave Management")}
              >
                <MdEventNote size={16} color="black" />
                <Text ml={2} fontWeight="bold">
                  Leave Management
                </Text>
              </Text>
            </>
          )}

          {userRole === "Employee" && (
            <>
              <Text
                as="button"
                cursor="pointer"
                bg={selectedOption === "Leave Record" ? "blue.400" : "blue.100"}
                color={selectedOption === "Leave Record" ? "black" : "gray.600"}
                px={3}
                py={2}
                borderRadius="lg"
                marginBottom={2}
                onClick={() => handleOptionClick("Leave Record")}
              >
                <MdHistory size={16} color="black" />
                <Text ml={2} fontWeight="bold">
                  Leave Record
                </Text>
              </Text>

              <Text
                as="button"
                cursor="pointer"
                bg={
                  selectedOption === "Attendance Record"
                    ? "blue.400"
                    : "blue.100"
                }
                color={
                  selectedOption === "Attendance Record" ? "black" : "gray.600"
                }
                px={3}
                py={2}
                borderRadius="lg"
                marginBottom={2}
                onClick={() => handleOptionClick("Attendance Record")}
              >
                <MdHistory size={16} color="black" />
                <Text ml={2} fontWeight="bold">
                  Attendance Record
                </Text>
              </Text>
            </>
          )}

          <Text
            as="button"
            cursor="pointer"
            bg={selectedOption === "Holiday" ? "blue.400" : "blue.100"}
            color={selectedOption === "Holiday" ? "black" : "gray.600"}
            px={3}
            py={2}
            borderRadius="lg"
            marginBottom={2}
            onClick={() => handleOptionClick("Holiday")}
          >
            <MdEventNote size={16} color="black" />
            <Text ml={2} fontWeight="bold">
              Holiday Calendar
            </Text>
          </Text>

          {employee.employeeType === "Hybrid" && (
            <>
              <Text
                as="button"
                cursor="pointer"
                bg={selectedOption === "Roster" ? "blue.400" : "blue.100"}
                color={selectedOption === "Roster" ? "black" : "gray.600"}
                px={3}
                py={2}
                borderRadius="lg"
                marginBottom={2}
                onClick={() => handleOptionClick("Roster")}
              >
                <MdDescription size={16} color="black" />
                <Text ml={2} fontWeight="bold">
                  Roster
                </Text>
              </Text>
            </>
          )}

          {userRole === "HR" && (
            <>
              <Text
                as="button"
                cursor="pointer"
                bg={
                  selectedOption === "Upload Roster" ? "blue.400" : "blue.100"
                }
                color={
                  selectedOption === "Upload Roster" ? "black" : "gray.600"
                }
                px={3}
                py={2}
                borderRadius="lg"
                marginBottom={2}
                onClick={() => handleOptionClick("Upload Roster")}
              >
                <MdDescription size={16} color="black" />
                <Text ml={2} fontWeight="bold">
                  Upload Roster
                </Text>
              </Text>
            </>
          )}

          <Text
            as="button"
            cursor="pointer"
            bg={selectedOption === "Documents" ? "blue.400" : "blue.100"}
            color={selectedOption === "Documents" ? "black" : "gray.600"}
            px={3}
            py={2}
            borderRadius="lg"
            marginBottom={2}
            onClick={() => handleOptionClick("Documents")}
          >
            <MdDescription size={16} color="black" />
            <Text ml={2} fontWeight="bold">
              Documents
            </Text>
          </Text>

                     <Text
            as="button"
            cursor="pointer"
            bg={selectedOption === "Helpus" ? "blue.400" : "blue.100"}
            color={selectedOption === "Helpus" ? "black" : "gray.600"}
            px={3}
            py={2}
            borderRadius="lg"
            marginBottom={2}
            onClick={() => handleOptionClick("Helpus")}
          >
            <AiOutlineQuestionCircle size={16} color="black" />
            <Text ml={2} fontWeight="bold">
              Help us
            </Text>
          </Text>
        </Box>
      </Box>
      <Box
        flex="1"
        padding="20px"
        backgroundColor="#F8F8F8"
        borderRadius="lg"
        overflowY="auto"
      >
        {selectedOption === "Leave Apply" && <LeaveApply />}
        {selectedOption === "Register Employee" && <Signup />}
        {selectedOption === "Attendance" && <Attendance />}
        {selectedOption === "Employee Details" && <EmployeeDetails />}
        {selectedOption === "My Profile" && <MyProfile />}
        {selectedOption === "Update Profile" && <UpdateProfile />}
        {selectedOption === "Holiday" && <Holiday />}
        {selectedOption === "Roster" && <Roster />}
        {selectedOption === "Department" && <Department />}
        {selectedOption === "Attendance Management" && <AttendanceManagement />}
        {selectedOption === "Leave Management" && <LeaveManagement />}
        {selectedOption === "Leave Record" && <LeaveRecord />}
        {selectedOption === "Attendance Record" && <AttendanceRecord />}
        {selectedOption === "Upload Roster" && <UploadRoster />}
        {selectedOption === "Documents" && <Documents />}
        {selectedOption === "Helpus" && <Helpus />}
      </Box>
    </Flex>
  );
};

export default Details;
