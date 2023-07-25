import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Stack,
  Spacer,
  Input,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
  Button,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Tooltip,
  ModalBody,
  ModalCloseButton,
  Select,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Switch,
} from "@chakra-ui/react";
import {
  EditIcon,
  WarningTwoIcon,
  SearchIcon,
  RepeatIcon,
} from "@chakra-ui/icons";
import {
  getAllEmployees,
  changeStatus,
  fetchProfile,
  reset,
  getAllDepartments,
  getAllManagers,
  getCurrentUserLeaveBalance,
} from "../../components/ApiServices";
import UserUpdateProfile from "./UserUpdateProfile";
import { FaCircle } from "react-icons/fa";

const EmployeeDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteEmployeeId, setDeleteEmployeeId] = useState(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [resetLeaveType, setResetLeaveType] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState({});
  const cancelRef = React.useRef();
  const toast = useToast();

  const fetchData = async () => {
    try {
      const employeeData = await getAllEmployees();
      setEmployees(employeeData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const profile = await fetchProfile();
        setCurrentUserId(profile.id);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();

    fetchDepartments();
    fetchManagers();
    fetchLeaveBalance();
  }, []);

  const fetchLeaveBalance = async (userId) => {
    try {
      const balance = await getCurrentUserLeaveBalance(userId);
      setLeaveBalance(balance);
    } catch (error) {
      console.error("Error retrieving leave balance:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const departmentData = await getAllDepartments();
      setDepartments(departmentData);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchManagers = async () => {
    try {
      const managersData = await getAllManagers();
      setManagers(managersData);
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  const filteredEmployees = employees
    .filter((employee) => employee.id !== currentUserId)
    .filter(
      (employee) =>
        String(employee.id).includes(searchQuery) ||
        `${employee.firstName} ${employee.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      await changeStatus(employeeId);
      toast({
        title: "Employee Status Changed Successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      fetchData();
      //window.location.reload();
    } catch (error) {
      console.error("Error changing status of the employee:", error);
      toast({
        title: "Error",
        description:
          "Failed to change the status of the employee. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteConfirmation = (employeeId) => {
    setDeleteEmployeeId(employeeId);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteEmployeeId(null);
    setIsDeleteAlertOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deleteEmployeeId) {
      handleDeleteEmployee(deleteEmployeeId);
      setDeleteEmployeeId(null);
      setIsDeleteAlertOpen(false);
    }
  };

  const handleEditEmployee = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setDialogOpen("edit");
  };

  const handleResetLeaveType = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setResetLeaveType(null);
    fetchLeaveBalance(employeeId);
    setDialogOpen("reset");
  };

  const handleCloseDialog = () => {
    setSelectedEmployeeId(null);
    setDialogOpen(false);
  };

  const handleLeaveTypeSelect = (leaveType) => {
    setResetLeaveType(leaveType);
  };

  const handleLeaveTypeReset = async () => {
    try {
      await reset(selectedEmployeeId, resetLeaveType);
      toast({
        title: "Leave type reset",
        description: resetLeaveType + " leave has been reset successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      handleCloseDialog();
    } catch (error) {
      console.error("Error resetting leave type:", error);
      toast({
        title: "Error",
        description: "Failed to reset leave type. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Filter active employees
  const activeEmployees = filteredEmployees.filter(
    (employee) => employee.status === "Active"
  );

  // Filter inactive employees
  const inactiveEmployees = filteredEmployees.filter(
    (employee) => employee.status !== "Active"
  );

  return (
    <Box p={4}>
      <Heading as="h1" size="xl" mb={4}>
        Employee List
      </Heading>
      <Box mb={4}>
        <Input
          placeholder="Search by ID or Name"
          value={searchQuery}
          onChange={handleSearch}
          size="sm"
          maxW="md"
          bg="white"
          borderRadius="md"
          boxShadow="sm"
          pr={8}
          paddingRight={12}
        />
        <IconButton
          icon={<SearchIcon />}
          aria-label="Search"
          position="absolute"
          top={0}
          right={0}
          bg="transparent"
          _hover={{ bg: "transparent" }}
        />
      </Box>
      <Tabs>
        <TabList>
          <Tab>Active Employees</Tab>
          <Tab>Inactive Employees</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {activeEmployees.length === 0 ? (
              <Text>No active employees found</Text>
            ) : (
              activeEmployees.map((employee) => (
                <Box
                  key={employee.id}
                  bg="white"
                  borderRadius="md"
                  boxShadow="md"
                  p={4}
                  mb={4}
                >
                  <Flex align="center" mb={2}>
                    <Text fontWeight="bold" fontSize="lg">
                      Employee ID: {employee.id}
                    </Text>
                    <Spacer />
                    <Stack direction="row" spacing={2}>
                      <Tooltip label="Update Employee Profile" hasArrow>
                        <IconButton
                          icon={<EditIcon />}
                          colorScheme="blue"
                          variant="outline"
                          aria-label="Edit Employee"
                          onClick={() => handleEditEmployee(employee.id)}
                        />
                      </Tooltip>
                      <Tooltip label="Change the status of Employee" hasArrow>
                        <Flex align={"center"}>
                          <Switch
                            isChecked
                            colorScheme="green"
                            size="lg"
                            onChange={() =>
                              handleDeleteConfirmation(employee.id)
                            }
                          />
                        </Flex>
                      </Tooltip>

                      <Tooltip label="Reset Leave Balance" hasArrow>
                        <IconButton
                          icon={<RepeatIcon />}
                          colorScheme="blue"
                          variant="outline"
                          aria-label="Reset Leave Type"
                          onClick={() => handleResetLeaveType(employee.id)}
                        />
                      </Tooltip>
                    </Stack>
                  </Flex>
                  <Text>
                    Name: {employee.firstName} {employee.lastName}
                  </Text>
                  <Text>Email: {employee.email}</Text>
                  <Text>Role: {employee.role}</Text>
                  <Text>Department: {employee.department}</Text>
                  <Text>Status: {employee.status}</Text>
                  <Text>Reporting Manger: {employee.manager}</Text>
                </Box>
              ))
            )}
          </TabPanel>
          <TabPanel>
            {inactiveEmployees.length === 0 ? (
              <Text>No inactive employees found</Text>
            ) : (
              inactiveEmployees.map((employee) => (
                <Box
                  key={employee.id}
                  bg="white"
                  borderRadius="md"
                  boxShadow="md"
                  p={4}
                  mb={4}
                >
                  <Flex align="center" mb={2}>
                    <Text fontWeight="bold" fontSize="lg">
                      Employee ID: {employee.id}
                    </Text>
                    <Spacer />
                    <Stack direction="row" spacing={2}>
                      <Tooltip label="Update Employee Profile" hasArrow>
                        <IconButton
                          icon={<EditIcon />}
                          colorScheme="blue"
                          variant="outline"
                          aria-label="Edit Employee"
                          onClick={() => handleEditEmployee(employee.id)}
                        />
                      </Tooltip>
                      <Tooltip label="Change the status of Employee" hasArrow>
                        <Flex align={"center"}>
                          <Switch
                            isChecked={false}
                            colorScheme="red"
                            size="lg"
                            onChange={() =>
                              handleDeleteConfirmation(employee.id)
                            }
                          />
                        </Flex>
                      </Tooltip>
                      <Tooltip label="Reset Leave Balance" hasArrow>
                        <IconButton
                          icon={<RepeatIcon />}
                          colorScheme="blue"
                          variant="outline"
                          aria-label="Reset Leave Type"
                          onClick={() => handleResetLeaveType(employee.id)}
                        />
                      </Tooltip>
                    </Stack>
                  </Flex>
                  <Text>
                    Name: {employee.firstName} {employee.lastName}
                  </Text>
                  <Text>Email: {employee.email}</Text>
                  <Text>Role: {employee.role}</Text>
                  <Text>Department: {employee.department}</Text>
                  <Text>Status: {employee.status}</Text>
                  <Text>Reporting Manger: {employee.manager}</Text>
                </Box>
              ))
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>

      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleDeleteCancel}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Change Status
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to change the status of the current
              employee?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleDeleteCancel}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                Change Status
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Modal isOpen={dialogOpen === "edit"} onClose={handleCloseDialog}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>User Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedEmployeeId && (
              <UserUpdateProfile
                id={selectedEmployeeId}
                departments={departments}
                managers={managers}
                onClose={handleCloseDialog}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={dialogOpen === "reset"} onClose={handleCloseDialog}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reset Leave Type</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedEmployeeId && (
              <Box mt={4}>
                <Text>Select leave type to reset:</Text>
                <Select
                  value={resetLeaveType}
                  onChange={(e) => handleLeaveTypeSelect(e.target.value)}
                >
                  <option value="Sick">
                    Sick [Balance: {leaveBalance.sickCount}]
                  </option>
                  <option value="Casual">
                    Casual [Balance: {leaveBalance.casualCount}]
                  </option>
                  <option value="Personal">
                    Personal [Balance: {leaveBalance.personalCount}]
                  </option>
                  {selectedEmployeeId &&
                    employees.find((emp) => emp.id === selectedEmployeeId)
                      ?.gender === "Female" && (
                      <option value="Maternity">
                        Maternity [Balance: {leaveBalance.maternityCount}]
                      </option>
                    )}
                  {selectedEmployeeId &&
                    employees.find((emp) => emp.id === selectedEmployeeId)
                      ?.gender === "Male" && (
                      <option value="Paternity">
                        Paternity [Balance: {leaveBalance.paternityCount}]
                      </option>
                    )}
                  <option value="Marriage">
                    Marriage [Balance: {leaveBalance.marriageCount}]
                  </option>
                </Select>
                <Button
                  colorScheme="blue"
                  onClick={handleLeaveTypeReset}
                  mt={4}
                >
                  Reset Leave Type
                </Button>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default EmployeeDetails;