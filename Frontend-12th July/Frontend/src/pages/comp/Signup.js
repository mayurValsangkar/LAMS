import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
  Select,
  Textarea,
  Alert,
  AlertIcon,
  Box,
  Heading,
  Tab,
  TabPanel,
  TabPanels,
  Tabs,
  TabList,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  bulkUpload,
  register,
  getAllDepartments,
  getAllManagers,
} from "../../components/ApiServices";

const jobTitles = [
  "Software Engineer",
  "Product Manager",
  "Graphic Designer",
  "Marketing Specialist",
  "Data Analyst",
  "Sales Representative",
  "Human Resources Manager",
  "Financial Analyst",
  "Operations Coordinator",
  "Content Writer",
  "Business Development Executive",
  "Customer Service Representative",
];

const designations = [
  "Junior",
  "Senior",
  "Associate",
  "Manager",
  "Director",
  "VP",
  "CFO",
  "CTO",
  "CEO",
  "Specialist",
  "Coordinator",
  "Analyst",
];

function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();

  if (month < 10) {
    month = "0" + month;
  }

  if (day < 10) {
    day = "0" + day;
  }

  return `${year}-${month}-${day}`;
}

const Signup = () => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    email: "",
    username: "",
    marriageStatus: "",
    country: "",
    permanentAddress: "",
    contactNumber: "",
    emergencyContactNumber: "",
    dob: "",
    joinDate: "",
    status: "Active",
    designation: "",
    jobTitle: "",
    employeeType: "",
    rosterType: "",
    department: "",
    manager: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [countries, setCountries] = useState([]);
  const [countryFlags, setCountryFlags] = useState([]);
  const toast = useToast();
  const history = useHistory();

  useEffect(() => {
    fetchDepartments();
    fetchManagers();
    fetchCountries();
  }, []);

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

const fetchCountries = async () => {
  try {
    const response = await fetch("https://restcountries.com/v2/all");
    const countryData = await response.json();
    
    const flags = countryData.map((country) => country.flags.png);
    
    setCountries(countryData);
    setCountryFlags(flags);
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
};


  const handleDepartmentChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedDepartment(selectedValue);
    setUser((prevUser) => ({
      ...prevUser,
      department: selectedValue,
    }));
  };

  const handleManagerChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedManager(selectedValue);
    setUser((prevUser) => ({
      ...prevUser,
      manager: selectedValue,
    }));
  };

  const handleDesignationChange = (e) => {
    setUser({ ...user, designation: e.target.value });
  };

  const handleJobTitleChange = (e) => {
    setUser({ ...user, jobTitle: e.target.value });
  };

  const isEmailValid = (email) => {
    // Email format validation using regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const shouldShowEmailAlert = user.email && !isEmailValid(user.email);

  const handleClick = () => setShow(!show);

  const submitHandler = async () => {
    setLoading(true);

    // Check for required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "gender",
      "email",
      "username",
      "marriageStatus",
      "country",
      "permanentAddress",
      "contactNumber",
      "dob",
      "joinDate",
      "designation",
      "jobTitle",
      "employeeType",
      "rosterType",
      "role",
    ];

    if (!user.department) {
      console.log("Please select a department");
      toast({
        title: "Please select a department",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if (!user.manager) {
      console.log("Please select a manager");
      toast({
        title: "Please select a manager",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    for (const field of requiredFields) {
      if (!user[field]) {
        console.log(`Please fill the ${field} field`);
        toast({
          title: `Please fill the ${field} field`,
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        return;
      }
    }

    register(user)
      .then(() => {
        toast({
          title: "Registration Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });

        setLoading(false);
        history.push("/dashboard");
      })
      .catch((error) => {
        toast({
          title: "Error Occurred!",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });

        setLoading(false);
      });
  };

  const handleBulkUpload = async (e) => {
    setLoading(true);

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await bulkUpload(formData);
      toast({
        title: "Bulk Upload Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      setLoading(false);
    }
  };

  return (
    <Box maxW="100%" w="100%" p={8} bg="white" boxShadow="md" rounded="md">
      <Heading as="h1" size="xl" mb={4}>
        Register New Employee
      </Heading>
      <Tabs isFitted variant="enclosed" colorScheme="teal">
        <TabList display="flex">
          <Tab _selected={{ color: "white", bg: "blue.500" }}>Register</Tab>
          <Tab _selected={{ color: "white", bg: "blue.500" }}>
            Multiple Registration
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <FormControl id="firstName" mb={4} isRequired>
              <FormLabel>First Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter your first name"
                value={user.firstName}
                onChange={(e) =>
                  setUser({ ...user, firstName: e.target.value })
                }
              />
            </FormControl>
            <FormControl id="middleName" mb={4}>
              <FormLabel>Middle Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter your middle name"
                value={user.middleName}
                onChange={(e) =>
                  setUser({ ...user, middleName: e.target.value })
                }
              />
            </FormControl>
            <FormControl id="lastName" mb={4} isRequired>
              <FormLabel>Last Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter your last name"
                value={user.lastName}
                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
              />
            </FormControl>
            <FormControl id="gender" mb={4} isRequired>
              <FormLabel>Gender</FormLabel>
              <Select
                placeholder="Select your gender"
                value={user.gender}
                onChange={(e) => setUser({ ...user, gender: e.target.value })}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Select>
            </FormControl>
            <FormControl id="email" mb={4} isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
              {shouldShowEmailAlert && (
                <Alert status="warning" mt={2}>
                  <AlertIcon />
                  Invalid email format.
                </Alert>
              )}
            </FormControl>
            <FormControl id="username" mb={4} isRequired>
              <FormLabel>Username</FormLabel>
              <InputGroup>
                <Input
                  type={show ? "text" : "password"}
                  placeholder="Enter your username"
                  value={user.username}
                  onChange={(e) =>
                    setUser({ ...user, username: e.target.value })
                  }
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl id="marriageStatus" mb={4} isRequired>
              <FormLabel>Marriage Status</FormLabel>
              <Select
                placeholder="Select your marriage status"
                value={user.marriageStatus}
                onChange={(e) =>
                  setUser({ ...user, marriageStatus: e.target.value })
                }
              >
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </Select>
            </FormControl>
<FormControl id="country" mb={4} isRequired>
  <FormLabel>Country</FormLabel>
  <Select
    placeholder="Select your country"
    value={user.country}
    onChange={(e) => setUser({ ...user, country: e.target.value })}
  >
    {countries.map((country) => (
      <option key={country.alpha2Code} value={country.alpha2Code}>
        {country.name}
      </option>
    ))}
  </Select>
</FormControl>
            <FormControl id="permanentAddress" mb={4} isRequired>
              <FormLabel>Permanent Address</FormLabel>
              <Textarea
                placeholder="Enter your permanent address"
                value={user.permanentAddress}
                onChange={(e) =>
                  setUser({ ...user, permanentAddress: e.target.value })
                }
              />
            </FormControl>
            <FormControl id="contactNumber" mb={4} isRequired>
              <FormLabel>Contact Number</FormLabel>
              <Input
                type="number"
                placeholder="Enter your contact number"
                value={user.contactNumber}
                onChange={(e) =>
                  setUser({ ...user, contactNumber: e.target.value })
                }
              />
            </FormControl>
            <FormControl id="emergencyContactNumber" mb={4} isRequired>
              <FormLabel>Emergency Contact Number</FormLabel>
              <Input
                type="number"
                placeholder="Enter your emergency contact number"
                value={user.emergencyContactNumber}
                onChange={(e) =>
                  setUser({ ...user, emergencyContactNumber: e.target.value })
                }
              />
            </FormControl>
            <FormControl id="dob" mb={4} isRequired>
              <FormLabel>Date of Birth</FormLabel>
              <Input
                type="date"
                max={getCurrentDate()}
                placeholder="Select your date of birth"
                value={user.dob}
                onChange={(e) => setUser({ ...user, dob: e.target.value })}
              />
            </FormControl>
            <FormControl id="joinDate" mb={4} isRequired>
              <FormLabel>Join Date</FormLabel>
              <Input
                type="date"
                placeholder="Select your join date"
                value={user.joinDate}
                onChange={(e) => setUser({ ...user, joinDate: e.target.value })}
              />
            </FormControl>

            <FormControl id="designation" mb={4} isRequired>
              <FormLabel>Designation</FormLabel>
              <Select
                placeholder="Select your designation"
                value={user.designation}
                onChange={handleDesignationChange}
              >
                {designations.map((designation) => (
                  <option key={designation} value={designation}>
                    {designation}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl id="jobTitle" mb={4} isRequired>
              <FormLabel>Job Title</FormLabel>
              <Select
                placeholder="Select your job title"
                value={user.jobTitle}
                onChange={handleJobTitleChange}
              >
                {jobTitles.map((jobTitle) => (
                  <option key={jobTitle} value={jobTitle}>
                    {jobTitle}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl id="employeeType" mb={4} isRequired>
              <FormLabel>Employee Type</FormLabel>
              <Select
                placeholder="Select your employee type"
                value={user.employeeType}
                onChange={(e) =>
                  setUser({ ...user, employeeType: e.target.value })
                }
              >
                <option value="Hybrid">Hybrid</option>
                <option value="Virtual">Virtual</option>
              </Select>
            </FormControl>
            <FormControl id="rosterType" mb={4} isRequired>
              <FormLabel>Roster Type</FormLabel>
              <Select
                placeholder="Select your roster type"
                value={user.rosterType}
                onChange={(e) =>
                  setUser({ ...user, rosterType: e.target.value })
                }
              >
                <option value="WFH">WFH</option>
                <option value="WFO">WFO</option>
              </Select>
            </FormControl>
            <FormControl id="department" mb={4} isRequired>
              <FormLabel>Department</FormLabel>
              <Select
                placeholder="Select department"
                value={selectedDepartment}
                onChange={handleDepartmentChange}
              >
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl id="manager" mb={4} isRequired>
              <FormLabel>Manager</FormLabel>
              <Select
                placeholder="Select Manager"
                value={selectedManager}
                onChange={handleManagerChange}
              >
                {managers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName +
                      " " +
                      user.lastName +
                      " [Id: " +
                      user.id +
                      "]"}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl id="role" mb={4} isRequired>
              <FormLabel>Role</FormLabel>
              <Select
                placeholder="Select your role"
                value={user.role}
                onChange={(e) => setUser({ ...user, role: e.target.value })}
              >
                <option value="HR">HR</option>
                <option value="Employee">Employee</option>
                <option value="Manager">Manager</option>
              </Select>
            </FormControl>
            <Button
              width="full"
              mt={4}
              colorScheme="blue"
              isLoading={loading}
              onClick={submitHandler}
            >
              Register
            </Button>
          </TabPanel>
          <TabPanel>
            <VStack spacing={4} align="stretch">
              <FormControl id="bulkUpload" isRequired>
                <FormLabel>Bulk Upload</FormLabel>
                <Input
                  type="file"
                  accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={handleBulkUpload}
                />
              </FormControl>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Signup;
